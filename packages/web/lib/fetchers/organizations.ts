"use server";

import { fetchUser } from "@/app/dashboard/userActions";
import { Organization, Repository } from "@core/db/types";
import { cFetch } from "./shared";

export const fetchOrganizations = async () =>
  await cFetch<Organization[]>(`/gh/installations`, {
    user: await fetchUser(),
  });

export const fetchOrganization = async (orgId: number) => {
  // TODO: should probably add a method to fetch a single repo from the DB
  const organizations = await fetchOrganizations();
  const organization = organizations.find((org) => org.id === orgId);

  if (!organization) {
    throw new Error(`Organization ${orgId} not found`);
  }

  return organization;
};

export const fetchRepositories = async (orgId: number) =>
  await cFetch<Repository[]>(`/gh/installations/${orgId}/repositories`, {
    user: await fetchUser(),
  });

export const fetchSlackRepositories = async (orgId: number) =>
  await cFetch<Repository[]>(`/slack/${orgId}/installations`, {
    user: await fetchUser(),
  });

export const setActiveRepo = async (repoId: number, isActive: boolean) =>
  await cFetch(`/gh/repositories/${repoId}`, {
    body: JSON.stringify({ isActive }),
    user: await fetchUser(),
    method: "PUT",
  });
