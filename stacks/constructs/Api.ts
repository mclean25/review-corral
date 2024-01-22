import { Construct } from "constructs";
import {
  ApiRouteProps,
  App,
  FunctionProps,
  Api as SstApi,
  Stack,
} from "sst/constructs";

export const HOSTED_ZONE = "review-corral.com";
export const PROD_STAGE = "prod";

export class Api extends Construct {
  readonly api: SstApi;

  static getDomain(app: App) {
    if (app.stage.startsWith(PROD_STAGE)) return `api.${HOSTED_ZONE}`;

    return `${app.stage}-api.${HOSTED_ZONE}`;
  }

  constructor(
    stack: Stack,
    id: string,
    { app, functionDefaults }: { app: App; functionDefaults: FunctionProps }
  ) {
    super(stack, id);

    this.api = new SstApi(stack, "api", {
      customDomain: {
        domainName: Api.getDomain(app),
        hostedZone: HOSTED_ZONE,
      },
      defaults: {
        function: functionDefaults,
      },
      routes: {
        "GET /": "packages/functions/src/lambda.handler",
        // TODO: only for testing, should be removed
        "GET /list": "packages/functions/src/todo.list",
        "GET /profile": "packages/functions/src/todo.getUser",

        "GET /{organizationId}/usernames":
          "packages/functions/src/usernames/lambda.getUsernameMappings",

        ...buildPaths("/gh", {
          // Handles incoming webhooks from Github
          "POST /webhook-event": "packages/functions/src/github/events.handler",
          ...buildPaths("/installations", {
            "GET /":
              "packages/functions/src/github/installations.getInstallations",

            ...buildPaths("/{organizationId}", {
              "GET /repositories":
                "packages/functions/src/github/repositories/getAll.handler",
              "GET /members":
                "packages/functions/src/github/members.getOrganizationMembers",
            }),
          }),
          "PUT /repositories/{repositoryId}":
            "packages/functions/src/github/repositories/setStatus.handler",
        }),

        ...buildPaths("/slack", {
          "GET /oauth": "packages/functions/src/slack/oauth.handler",

          ...buildPaths("/{organizationId}", {
            "GET /installations":
              "packages/functions/src/slack/installations.getSlackInstallations",
            "GET /users": "packages/functions/src/slack/installations.getUsers",
          }),
        }),
      },
    });
  }
}

const buildPaths = <T extends ApiRouteProps<string>>(
  basePath: string,
  routes: Record<string, T>
) =>
  Object.keys(routes).reduce((acc, key) => {
    const splitKey = key.split(" ");

    if (splitKey.length !== 2) {
      throw Error(
        `Invalid route key of '${key}' found.` +
          `Should contain a method and then the path like so: 'GET /path'`
      );
    }

    // Ignore trailing slashes
    const newKey = `${splitKey[0]} ${basePath}${
      splitKey[1] === "/" ? "" : splitKey[1]
    }`;

    return {
      ...acc,
      [newKey]: routes[key],
    };
  }, {});
