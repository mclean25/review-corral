import axios from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { isValidBody } from "../../../components/api/utils/apiUtils";
import withApiSupabase from "../../../components/api/utils/withApiSupabase";
import { getSlackRedirectUrl } from "../../../components/SlackButton";
import { flattenParam } from "../../../components/utils/flattenParam";
import { Database } from "../../../database-types";

export type SlackAuthQueryParams = {
  code: string;
  state: string; // should be organization ID
};

export interface SlackAuthEvent {
  ok: boolean;
  app_id: string;
  scope: string;
  access_token: string;
  team: Team;
  incoming_webhook: IncomingWebhook;
}

export interface Team {
  name: string;
  id: string;
}

export interface IncomingWebhook {
  channel: string;
  channel_id: string;
  configuration_url: string;
  url: string;
}

export default withApiSupabase<Database>(async function ProtectedRoute(
  req,
  res,
  supabaseServerClient,
) {
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw new ApiError(500, "Missing NEXT_PUBLIC_BASE_URL");
  }

  if (
    req.method === "GET" &&
    isValidBody<SlackAuthQueryParams>(req.query, ["code", "state"])
  ) {
    console.info("Got request to GET /api/slack: ", req.query);

    const state = flattenParam(req.query.state);

    if (!state) {
      throw new ApiError(
        500,
        "No state (organization_id) provided in Slack integration OAuth",
      );
    }

    axios
      .postForm<
        {
          client_id: string;
          code: string;
          client_secret: string;
          redirect_uri: string;
        },
        { data: SlackAuthEvent }
      >("https://slack.com/api/oauth.v2.access", {
        client_id: process.env.NEXT_PUBLIC_SLACK_BOT_ID,
        code: req.query.code,
        client_secret: process.env.SLACK_CLIENT_SECRET,
        redirect_uri: getSlackRedirectUrl(),
      })
      .then(async ({ data }) => {
        const { error } = await supabaseServerClient
          .from("slack_integration")
          .insert({
            access_token: data.access_token,
            channel_id: data.incoming_webhook.channel_id,
            channel_name: data.incoming_webhook.channel,
            organization_id: state,
            slack_team_name: data.team.name,
            slack_team_id: data.team.id,
          });

        if (error) {
          console.error(
            `Error inserting slack_integration for ${req.body.state}: ${error}`,
          );
          return res.status(500).end();
        }

        return res.status(200).end();
      })
      .catch((error) => {
        console.error(
          `Error for oAuth with Slack for ${req.body.state}: ${error}`,
        );
        return res.status(500).end();
      });

    const { data, error } = await supabaseServerClient
      .from("organizations")
      .select("*")
      .eq("id", state)
      .single();

    if (data) {
      return res
        .redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/org/${data.account_id}`)
        .end();
    } else {
      return res.redirect(process.env.NEXT_PUBLIC_BASE_URL).end();
    }
  } else {
    return res.status(404);
  }
});