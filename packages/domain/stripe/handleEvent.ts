import { stripeCheckoutCreatedMetadataSchema } from "@core/stripe/types";
import {
  fetchOrganizationByAccountId,
  updateOrganizationStripeProps,
} from "@domain/dynamodb/fetchers/organizations";
import {
  updateSubscription,
  upsertSubscription,
} from "@domain/dynamodb/fetchers/subscription";
import { Logger } from "@domain/logging";
import Stripe from "stripe";

const LOGGER = new Logger("stripe.handleEvent");

export const handleSubUpdated = async (
  event: Stripe.CustomerSubscriptionUpdatedEvent,
) => {
  LOGGER.info(`📝 Subscription updated: ${event.id}`, { event });

  const actualEvent = event.data.object;

  if (!actualEvent.status) {
    LOGGER.warn("Recieved subUpdated event without status", { actualEvent: event });
    return;
  }

  const priceId = actualEvent.items.data[0].price?.id;

  if (!priceId) {
    LOGGER.warn("Recieved subCreated event without priceId", {
      actualEvent: event,
      priceId,
    });
    return;
  }

  if (typeof actualEvent.customer !== "string") {
    LOGGER.error("Recieved subUpdated event where customer is not a string", {
      actualEvent: event,
      typeofCustomer: typeof actualEvent.customer,
    });
    return;
  }

  const args = {
    customerId: actualEvent.customer.toString(),
    status: actualEvent.status,
    subId: actualEvent.id,
    priceId: priceId,
  };

  const sub = await upsertSubscription(args);

  if (sub.data.orgId) {
    // Update the organization with the new info for quicker access
    LOGGER.info(`Updating org stripe sub status...`);
    await updateOrganizationStripeProps({
      orgId: sub.data.orgId,
      customerId: actualEvent.customer,
      stripeSubStatus: actualEvent.status,
    });
  }

  LOGGER.info(`Subscription updated`, args);
};

/**
 * The metadata sent to the checkout session (annoyingly) wont be attached to
 * the subscription events, so we use this event to set these properties which we can
 * then use later
 */
export const handleSessionCompleted = async (
  event: Stripe.CheckoutSessionCompletedEvent,
) => {
  LOGGER.info(`🚀 Session completed: ${event.id}`, { event });

  const actualEvent = event.data.object;
  const metadata = stripeCheckoutCreatedMetadataSchema.safeParse(actualEvent.metadata);

  if (!metadata.success) {
    LOGGER.error(
      "Invalid metadata for sessionCompleted event",
      {
        parseResult: metadata,
        eventMetadata: actualEvent.metadata,
      },
      { depth: 5 },
    );
    return;
  }

  const org = await fetchOrganizationByAccountId(metadata.data.orgId);

  if (!org) {
    LOGGER.error("Organization not found for sessionCompleted event", { metadata });
    return;
  }

  if (typeof actualEvent.customer !== "string") {
    LOGGER.error("Recieved session completed event where customer is not a string", {
      actualEvent: event,
      typeofCustomer: typeof actualEvent.customer,
    });
    return;
  }

  if (typeof actualEvent.subscription !== "string") {
    LOGGER.error(
      "Recieved session completed event where subscription is not a string",
      {
        actualEvent: event,
        typeofCustomer: typeof actualEvent.subscription,
      },
    );
    return;
  }

  // Update the subscription with the OrgId for future use
  const newSub = await updateSubscription({
    subId: actualEvent.subscription,
    customerId: actualEvent.customer,
    orgId: org.orgId,
  });

  // Update the organization with the new info for quicker access
  await updateOrganizationStripeProps({
    orgId: org.orgId,
    customerId: actualEvent.customer,
    stripeSubStatus: newSub.data.status,
  });
};
