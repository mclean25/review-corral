import { BadRequestException, Injectable } from "@nestjs/common";
import { github_integration, github_repositories } from "@prisma/client";
import axios from "axios";

import { PrismaService } from "src/prisma/prisma.service";
import { InstalledRepository } from "types/githubAppTypes";
import { Installations } from "./types";
import { getInstallationAccessToken } from "./utils";

export interface CreateTeamRepoBody {
  teamId: string;
  repositoryName: string;
  repositoryId: number;
  installationId: number;
}

export interface InstalledRepositoryWithInstallationId
  extends InstalledRepository {
  installationId: number;
}

@Injectable()
export class GithubAppService {
  constructor(private prisma: PrismaService) {}

  async getIntegration(teamId: string): Promise<github_integration> {
    return await this.prisma.github_integration.findUnique({
      where: {
        team_id: teamId,
      },
    });
  }

  async getTeamSyncedRepos(teamId: string): Promise<github_repositories[]> {
    return this.prisma.github_repositories.findMany({
      where: { team_id: teamId },
    });
  }

  async addTeamRepository(body: CreateTeamRepoBody) {
    await this.prisma.github_repositories
      .create({
        data: {
          team_id: body.teamId,
          repository_id: body.repositoryId.toString(),
          repository_name: body.repositoryName,
          installation_id: body.installationId,
        },
      })
      .then(() => console.log("Successfully created team repository"))
      .catch((error) => {
        console.log("Error creating team repository: ", error);
        throw error;
      });
  }

  async deleteSyncedTeamRepo(repoId: string) {
    await this.prisma.github_repositories
      .delete({
        where: { repository_id: repoId },
      })
      .then(() => console.log("Successfully deleted team repository"))
      .catch((error) => {
        console.log("Error deleting team repository: ", error);
        throw error;
      });
  }

  async getUserAccessToken(code: string, teamId: string) {
    const params = new URLSearchParams();
    params.append("client_id", process.env.GITHUB_CLIENT_ID);
    params.append("client_secret", process.env.GITHUB_CLIENT_SECRET);
    params.append("code", code);

    const url = new URL("https://github.com/login/oauth/access_token");
    url.search = params.toString();

    axios
      .post(url.toString(), undefined, {
        headers: { accept: "application/json" },
      })
      .then(async (response) => {
        if (!response.data.access_token) {
          throw Error(
            `Didn't get access token in getUserAccessToken. Response: ${response}`,
          );
        }

        const foundIntegration =
          await this.prisma.github_integration.findUnique({
            where: { team_id: teamId },
          });

        if (foundIntegration) {
          this.prisma.github_integration
            .update({
              where: { id: foundIntegration.id },
              data: {
                access_token: response.data.access_token,
              },
            })
            .then(() => console.log("Successfully updated Github Integration"))
            .catch((error) => {
              console.log("Error updating Github Integration: ", error);
              throw error;
            });
        } else {
          this.prisma.github_integration
            .create({
              data: {
                team_id: teamId,
                access_token: response.data.access_token,
              },
            })
            .then(() => console.log("success creating gihub integration"))
            .catch((error) => {
              console.log("Error creating integration: ", error);
              throw error;
            });
        }
      })
      .catch((error) => {
        console.log("Error getting access token: ", error);
        throw error;
      });
  }

  async getTeamInstaledRepos(
    teamId: string,
  ): Promise<InstalledRepositoryWithInstallationId[] | undefined> {
    console.log("Getting team repositories for team: ", teamId);
    const foundIntegration = await this.prisma.github_integration.findUnique({
      where: { team_id: teamId },
    });

    if (!foundIntegration?.access_token) {
      throw new BadRequestException("No Github integration found");
    }

    return axios
      .get<Installations>("https://api.github.com/user/installations", {
        headers: {
          Authorization: `token ${foundIntegration.access_token}`,
        },
      })
      .then(
        async (
          installations,
        ): Promise<InstalledRepositoryWithInstallationId[] | undefined> => {
          if (installations.data.total_count > 0) {
            const r = installations.data.installations.map(
              async (installation) => {
                return await getInstallationAccessToken(
                  installation.id.toString(),
                )
                  .then(async (accessResponse) => {
                    console.log("Got installation access token");
                    return {
                      ...(await this.getInstalledRepositoryInfo(
                        accessResponse.token,
                      )),
                      installationId: installation.id,
                    };
                  })
                  .catch((error) => {
                    console.log(
                      "Got error getting installation access token: ",
                      error,
                    );
                    throw new BadRequestException(error);
                  });
              },
            );
            return Promise.all(r);
          } else {
            return undefined;
          }
        },
      )
      .catch((error) => {
        console.log("Got error getting user installations: ", error);
        throw new BadRequestException(error);
      });
  }

  private async getInstalledRepositoryInfo(
    installationAccessToken: string,
  ): Promise<InstalledRepository> {
    return axios
      .get<InstalledRepository>(
        "https://api.github.com/installation/repositories",
        {
          headers: {
            Authorization: `bearer ${installationAccessToken}`,
          },
        },
      )
      .then((repository) => {
        return repository.data;
      })
      .catch((error) => {
        console.log("Got error getting repository info: ", error);
        throw error;
      });
  }
}
