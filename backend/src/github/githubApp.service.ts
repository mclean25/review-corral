import { Injectable, NotFoundException } from "@nestjs/common";
import axios from "axios";
import * as nJwt from "njwt";
import { PrismaService } from "src/prisma/prisma.service";
import { Repositories } from "types/githubAppTypes";
import { Team } from "types/slackAuthTypes";

@Injectable()
export class GithubAppService {
  constructor(private prisma: PrismaService) {}

  async getRepositories(teamId: Team["id"]): Promise<Repositories> {
    console.log("Got team id:", teamId);
    const github_integration = await this.prisma.github_integration.findUnique({
      where: {
        team_id: teamId,
      },
    });

    console.log("github_integration:", github_integration);

    if (!github_integration || !github_integration.access_token) {
      throw new NotFoundException("No github integration found");
    }

    const response = await axios.get<Repositories>(
      "https://api.github.com/user/installations",
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `token ${github_integration.access_token}`,
        },
      },
    );

    console.log(response.data);

    return response.data;
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
        console.log("Got access token: ", response.data.access_token);

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

  async getJwt(): Promise<string> {
    const now = Math.floor(Date.now() / 1000) - 30;
    const expiration = now + 120; // JWT expiration time (10 minute maximum)
    const claims = {
      // issued at time, 60 seconds in the past to allow for clock drift
      iat: now,
      // JWT expiration time (10 minute maximum)
      exp: expiration,
      iss: process.env.GITHUB_APP_ID,
    };

    let jwt = nJwt.create(
      claims,
      process.env.GITHUB_APP_JWT_SIGNING_SECRET,
      "RS256",
    );

    jwt = jwt.setExpiration(new Date().getTime() + 60 * 2);

    return jwt.toString();
  }
}
