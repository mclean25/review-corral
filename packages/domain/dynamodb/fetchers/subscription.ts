import {
  Subscription,
  SubscriptionInsertArgs,
  SubscriptionUpdateArgs,
} from "@core/dynamodb/entities/types";
import { Db } from "../client";

interface SubscriptionKeys {
  customerId: string;
  subId: string;
}

export const fetchSubscriptionsByCustomerId = async (
  customerId: string,
): Promise<Subscription[]> => {
  return await Db.entities.subscription.query
    .primary({ customerId })
    .go()
    .then(({ data }) => data);
};

export const fetchSubscription = async ({
  customerId,
  subId,
}: SubscriptionKeys): Promise<Subscription[]> => {
  return await Db.entities.subscription.query
    .primary({ customerId, subId })
    .go()
    .then(({ data }) => data);
};

export const insertSubscription = async (
  args: SubscriptionInsertArgs,
): Promise<Subscription> => {
  return await Db.entities.subscription
    .create(args)
    .go()
    .then(({ data }) => data);
};

export const updateSubscription = async ({
  subId,
  customerId,
  ...stripeArgs
}: SubscriptionKeys & SubscriptionUpdateArgs) => {
  return await Db.entities.subscription
    .patch({ subId, customerId })
    .set(stripeArgs)
    .go({ response: "all_new" });
};

export const upsertSubscription = async (args: SubscriptionInsertArgs) => {
  await Db.entities.subscription.upsert(args).go();
};
