import { FC } from "react";
import { GithubCard as GithubOverviewCard } from "./github/GithubOverviewCard";
import { Header, OrgViewProps } from "./shared";
import { SlackOverviewCard } from "./slack/SlackOverviewCard";

interface OverviewProps extends OrgViewProps {}

export const OverviewTab: FC<OverviewProps> = ({ organization, setPage }) => {
  return (
    <div className="space-y-12">
      <Header>Overview</Header>
      <div className="flex justify-between items-start">
        <div className="flex flex-wrap">
          <GithubOverviewCard
            organization={organization}
            onEdit={() => {
              setPage("github");
            }}
          />
        </div>
        <div className="flex flex-wrap">
          <SlackOverviewCard
            organization={organization}
            onEdit={() => {
              setPage("slack");
            }}
          />
        </div>
      </div>
    </div>
  );
};
