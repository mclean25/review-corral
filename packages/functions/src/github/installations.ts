import { Organization, User } from "@core/dynamodb/entities/types";
import { addOrganizationMember } from "@core/dynamodb/fetchers/members";
import {
  fetchOrganizationByAccountId,
  fetchUsersOrganizations,
  insertOrganizationAndAssociateUser,
  updateOrganizationInstallationId,
} from "@core/dynamodb/fetchers/organizations";
import { InstallationsData } from "@core/github/endpointTypes";
import { getUserInstallations } from "@core/github/fetchers";
import { Logger } from "@core/logging";
import { useUser } from "src/utils/useUser";
import { ApiHandler } from "sst/node/api";

const LOGGER = new Logger("github:installations");

export const getInstallations = ApiHandler(async (event, context) => {
  const { user, error } = await useUser();

  if (!user) {
    LOGGER.error("No user found in session", { error });
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  // Installations appear to have effectively a 1:1 mapping with organizations
  const installations = await getUserInstallations(user);

  LOGGER.debug("Installations fetch response: ", { installations });

  const organizations: Organization[] = await getOrganizations(
    user,
    installations
  );

  return {
    statusCode: 200,
    body: JSON.stringify(organizations),
  };
});

/**
 * Syncs the local database Organizations with the installations response from
 * GitHub, then returns the organizations the user has access to.
 */
async function getOrganizations(user: User, installations: InstallationsData) {
  const organizations: Organization[] = [];

  const usersOrganizations = await fetchUsersOrganizations(user.userId);
  const usersOrganizationsIds = usersOrganizations.map((org) => org.orgId);

  for (const installation of installations.installations) {
    // Try to see if we find an organization with the same id (account id)
    // as the installation's account_id
    if (!installation.account?.login) {
      LOGGER.warn("Installation found with no account info", { installation });
      continue;
    }

    const organization = await fetchOrganizationByAccountId(
      installation.account.id
    );

    if (organization) {
      LOGGER.debug("Found organization for installation", { organization });
      // We should update the installation ID if it's different
      if (organization.installationId !== installation.id) {
        updateOrganizationInstallationId({
          orgId: organization.orgId,
          installationId: installation.id,
        });
      }

      // If the user isn't part of the existing organization (m2m), then add them to
      // it. this can happen if someone else installed the app into an organization
      // that the user is part of.
      if (!usersOrganizationsIds.includes(organization.orgId)) {
        LOGGER.info(
          "User is not part of organization. Associating user with organization..."
        );
        await addOrganizationMember({ orgId: organization.orgId, user });
      }

      organizations.push(organization);
    } else {
      LOGGER.info("No organization found for installation. Inserting...");
      const newOrg = await insertOrganizationAndAssociateUser({
        createOrgArgs: {
          orgId: installation.account.id,
          name: installation.account.login,
          avatarUrl: installation.account.avatar_url,
          installationId: installation.id,
          type: installation.account.type,
        },
        user,
      });
      organizations.push(newOrg);
    }
  }
  return organizations;
}
