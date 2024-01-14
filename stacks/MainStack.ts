import { SubnetType } from "aws-cdk-lib/aws-ec2";
import { FunctionProps, StackContext } from "sst/constructs";
import { getFrontendUrl } from "./FrontendStack";
import { Api } from "./constructs/Api";
import { getDbConnectionInfo } from "./constructs/Database";
import MigrationFunction from "./constructs/MigrationFunction";
import LambdaNaming from "./constructs/lambdaPermissions/LambdaNaming";
import LambdaPolicies from "./constructs/lambdaPermissions/LambdaPolicies";
import { assertVarExists } from "./utils/asserts";
import { buildPersistedResources } from "./utils/buildPerisistedResources";
import { enableLambdaOutboundNetworking } from "./utils/enableLambdaOutboundNetworking";

export function MainStack({ stack, app }: StackContext) {
  const { vpc, database, functionsSecurityGroup } = buildPersistedResources({
    stack,
    app,
  });

  const initalSlackEnvVars = {
    VITE_SLACK_BOT_ID: assertVarExists("SLACK_BOT_ID"),
    VITE_SLACK_CLIENT_SECRET: assertVarExists("SLACK_CLIENT_SECRET"),
  };
  const functionDefaults: FunctionProps = {
    architecture: "x86_64",
    vpc: vpc,
    securityGroups: functionsSecurityGroup
      ? [functionsSecurityGroup]
      : undefined,
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
      ...getDbConnectionInfo(app, database),
    },
    logRetention: app.local ? "one_week" : "one_year",
    runtime: "nodejs18.x",
    // Combined with the Elastic IP(s), these settings enable outbound internet access
    // without the need for costly NAT Gateways
    allowPublicSubnet: Boolean(vpc),
    vpcSubnets: vpc ? { subnetType: SubnetType.PUBLIC } : undefined,
  };
  // Set the default props for all stacks
  stack.setDefaultFunctionProps(functionDefaults);

  const migrationFunction = new MigrationFunction(stack, "MigrateToLatest", {
    app,
    database,
    functionDefaults,
  });

  const api = new Api(stack, "Api", { app, functionDefaults });

  const slackEnvVars = {
    ...initalSlackEnvVars,
    VITE_SLACK_AUTH_URL: `${api.api.url}/slack/oauth`,
  };

  stack.addDefaultFunctionEnv(slackEnvVars);

  // Needs to be done after ALL lambdas are created
  new LambdaNaming(stack, "LambdaNaming");
  new LambdaPolicies(stack, "LambdaPermissions", {
    secretArns: database ? [database.secret.secretArn] : [],
  });

  if (vpc && functionsSecurityGroup) {
    // It doesn't really matter which Lambda function is passed in here; one is needed
    // simply to determine which network interfaces need Elastic IPs
    enableLambdaOutboundNetworking(stack, vpc, migrationFunction);
  }

  stack.addOutputs({
    MigrationFunction: migrationFunction.functionName,
    apiUrl: api.api.customDomainUrl ?? api.api.url,
    ...(database
      ? {
          databaseId: database.instance.instanceIdentifier,
          secretsArn: database.secret.secretArn,
        }
      : {}),
  });

  return {
    api,
    slackEnvVars,
    vpc,
    database,
    functionsSecurityGroup,
    migrationFunction,
  };
}
