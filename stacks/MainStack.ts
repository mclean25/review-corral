import { Function, FunctionProps, StackContext, use } from "sst/constructs";
import { getFrontendUrl } from "./FrontendStack";
import { StorageStack } from "./StorageStack";
import { Api } from "./constructs/Api";
import LambdaNaming from "./constructs/lambdaPermissions/LambdaNaming";
import { assertVarExists } from "./utils/asserts";

export function MainStack({ stack, app }: StackContext) {
  const { table } = use(StorageStack);

  const slackEnvVars = {
    VITE_SLACK_BOT_ID: assertVarExists("SLACK_BOT_ID"),
    VITE_SLACK_CLIENT_SECRET: assertVarExists("SLACK_CLIENT_SECRET"),
    VITE_SLACK_AUTH_URL: `https://${Api.getDomain(app)}/slack/oauth`,
  };
  const functionDefaults: FunctionProps = {
    architecture: "x86_64",
    environment: {
      BASE_FE_URL: getFrontendUrl(app),
      IS_LOCAL: app.local ? "true" : "false",
      MIGRATIONS_PATH: "packages/core/src/database/migrations",
      // This isn't in the slackEnvVars because we don't want it on the frontend
      SLACK_BOT_TOKEN: assertVarExists("SLACK_BOT_TOKEN"),
      LOG_LEVEL: process.env.LOG_LEVEL ?? "INFO",
      GH_APP_ID: assertVarExists("GH_APP_ID"),
      GH_CLIENT_ID: assertVarExists("GH_CLIENT_ID"),
      GH_CLIENT_SECRET: assertVarExists("GH_CLIENT_SECRET"),
      GH_ENCODED_PEM: assertVarExists("GH_ENCODED_PEM"),
      GH_WEBHOOK_SECRET: assertVarExists("GH_WEBHOOK_SECRET"),
      ...slackEnvVars,
    },
    logRetention: app.local ? "one_week" : "one_year",
    runtime: "nodejs18.x",
    bind: [table],
  };

  stack.setDefaultFunctionProps(functionDefaults);

  new Function(stack, "GetInstallationAccessToken", {
    handler: "packages/functions/src/admin/installationAccessToken.handler",
  });

  new Function(stack, "MigrateToDynamo", {
    handler: "packages/functions/src/admin/migrateToDynamo.handler",
    timeout: "5 minutes",
  });

  // Set the default props for all stacks

  const api = new Api(stack, "Api", { app, functionDefaults });
  api.api.bind([table]);

  // Needs to be done after ALL lambdas are created
  new LambdaNaming(stack, "LambdaNaming");

  stack.addOutputs({
    apiUrl: api.api.customDomainUrl ?? api.api.url,
  });

  return {
    api,
    slackEnvVars,
  };
}
