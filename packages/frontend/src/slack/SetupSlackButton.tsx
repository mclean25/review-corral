import { Test } from "@";
import { Button } from "@components/ui";
import React from "react";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";

interface SlackButtonProps {
  organizationId: string;
}

const SlackButton: React.FC<SlackButtonProps> = ({ organizationId }) => {
  const slackRedirectUrl = getSlackRedirectUrl();
  const queryClient = useQueryClient();

  if (!process.env.NEXT_PUBLIC_SLACK_BOT_ID) {
    throw Error("NEXT_PUBLIC_SLACK_BOT_ID not set");
  }

  const searchParams = new URLSearchParams({
    state: organizationId,
    redirect_uri: slackRedirectUrl,
    client_id: process.env.NEXT_PUBLIC_SLACK_BOT_ID,
    scope:
      "channels:history,chat:write,commands,groups:history,incoming-webhook,users:read",
    user_scope: "",
  });

  return (
    <div>
      <Test />
      <Link
        to={`https://slack.com/oauth/v2/authorize?${searchParams.toString()}`}
        onClick={() => {
          // TODO:
          queryClient.invalidateQueries([]);
        }}
      >
        <Button color="indigo">Connect to Slack</Button>
      </Link>
    </div>
  );
};

export default SlackButton;

export const getSlackRedirectUrl = (): string => {
  // TODO: this is much more complicated than it should be
  if (process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL) {
    return process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL;
  }

  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    throw Error("NEXT_PUBLIC_SLACK_REDIRECT_URL not set");
  }

  return `${process.env.NEXT_PUBLIC_BASE_URL}api/slack/oauth`;
};