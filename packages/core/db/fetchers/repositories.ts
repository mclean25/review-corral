import { eq } from "drizzle-orm";
import { DB } from "../db";
import { repositories } from "../schema";
import { Repository, RepositoryInsertArgs } from "../types";
import { takeFirstOrThrow } from "./utils";

export const fetchRepositoriesForOrganization = async (
  organizationId: number
): Promise<Repository[]> =>
  await DB.select()
    .from(repositories)
    .where(eq(repositories.organizationId, organizationId));

export const insertRepository = async (
  args: RepositoryInsertArgs
): Promise<Repository> => {
  return await DB.insert(repositories)
    .values(args)
    .onConflictDoUpdate({
      target: [repositories.id],
      set: args,
    })
    .returning()
    .then(takeFirstOrThrow);
};

export const removeRepository = async (id: number): Promise<void> => {
  await DB.delete(repositories).where(eq(repositories.id, id));
};