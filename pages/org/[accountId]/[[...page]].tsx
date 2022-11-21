import { SupabaseClient } from "@supabase/supabase-js";
import type { GetServerSidePropsContext, NextPage, PreviewData } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { ReactNode, useState } from "react";
import { Github } from "../../../components/assets/icons/Github";
import { Slack } from "../../../components/assets/icons/Slack";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { SlackIntegrations } from "../../../components/organization/slack/SlackIntegrations";
import { UsernameMappings } from "../../../components/organization/slack/username-mappings/UsernameMappings";
import { flattenParam } from "../../../components/utils/flattenParam";
import { withPageAuth } from "../../../components/utils/withPageAuth";
import { Database } from "../../../database-types";

export type Pages = "github" | "slack" | "usernames";

export type Organization = Database["public"]["Tables"]["organizations"]["Row"];

type SubNav = {
  text: string;
  page: Pages | undefined;
};

const routes: SubNav[] = [
  {
    text: "Overview",
    page: undefined,
  },
  {
    text: "Github",
    page: "github",
  },
  {
    text: "Slack",
    page: "slack",
  },
  {
    text: "Usernames",
    page: "usernames",
  },
];

export const OrgView: NextPage<{
  organization: Organization;
  page: Pages | undefined;
}> = ({ organization, page }) => {
  const router = useRouter();
  const [_page, setPage] = useState<Pages | undefined>(page);

  const setPageWrapper = (page: Pages | undefined): void => {
    setPage(page);
    let route = "";
    if (page) {
      route = `/org/${organization.account_id}/${page}`;
    } else {
      route = `/org/${organization.account_id}`;
    }
    router.push(route, undefined, { shallow: true });
  };

  return (
    <DashboardLayout
      title={organization.account_name}
      activeOrganizationAccountId={organization.account_id}
      subnav={
        <>
          <div className="max-w-7xl mx-auto px-4 pt-4 pb-3 sm:px-6 lg:px-8 font-medium ">
            <ul>
              {routes.map((route) => (
                <li
                  key={route.text}
                  className={`
                    inline px-1 py-1 cursor-pointer text-base hover:bg-gray-100 rounded-md
                    `}
                  onClick={() => setPageWrapper(route.page)}
                >
                  <span
                    className={`
                      pb-[0.9rem]
                      px-1
                      ${
                        _page == route.page
                          ? "border-b-2 border-indigo-500"
                          : ""
                      }
                    `}
                  >
                    {route.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      }
    >
      {((): ReactNode => {
        const tabProps = { organization, setPage: setPageWrapper };

        switch (_page) {
          case "github":
            return <GithubTab {...tabProps} />;
          case "slack":
            return (
              <div id="slack">
                <h1 className="text-xl font-semibold">Slack</h1>
                <div className="rounded-md border border-gray-200">
                  <div className="flex p-4 bg-gray-100 rounded-md justify-between">
                    <Slack className="h-8 w-8 fill-black" />
                    <span className="font-semibold text-lg">
                      Slack Integration
                    </span>
                  </div>
                  <div className="px-4 py-6">
                    <SlackIntegrations organizationId={organization.id} />
                  </div>
                </div>
              </div>
            );
          case "usernames":
            return (
              <div id="usernames">
                {organization.organization_type === "Organization" && (
                  <UsernameMappings organizationId={organization.id} />
                )}
              </div>
            );
          default:
            return <OverviewTab {...tabProps} />;
        }
      })()}
    </DashboardLayout>
  );
};

import { FC } from "react";
import { ErrorAlert } from "../../../components/common/alerts/Error";
import { InfoAlert } from "../../../components/common/alerts/Info";
import { GithubTab } from "../../../components/organization/github/GithubTab";
import { useGetInstallationRepos } from "../../../components/organization/github/useGetInstallationRepos";
import { OverviewTab } from "../../../components/organization/Overview";

interface GithubCardProps {
  organization: Organization;
  onEdit: () => void;
}

export const GithubCard: FC<GithubCardProps> = ({ organization, onEdit }) => {
  return (
    <div id="github">
      <div className="rounded-md border border-gray-200">
        <div className="flex p-4 bg-gray-100 rounded-t-md justify-between items-center w-96">
          <div className="flex gap-4 items-center">
            <Github className="h-8 w-8 fill-black" />
            <span className="font-semibold text-lg">Enabled Repositories</span>
          </div>
          <div
            className="cursor-pointer underline text-indigo-500 underline-offset-2"
            onClick={() => onEdit()}
          >
            Edit
          </div>
        </div>
        <div className="px-4 py-6">
          <GithubCardData organization={organization} onEdit={onEdit} />
        </div>
      </div>
    </div>
  );
};

interface GithubCardDataProps {
  organization: Organization;
  onEdit: () => void;
}

export const GithubCardData: FC<GithubCardDataProps> = ({
  organization,
  onEdit,
}) => {
  const getInstalledRepos = useGetInstallationRepos(
    organization.installation_id,
  );

  if (getInstalledRepos.isLoading) {
    return (
      <div>
        <ul className="space-y-4">
          {Array.from(Array(3).keys()).map((num) => (
            <li
              key={num}
              className="h-6 w-[80%] rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </ul>
      </div>
    );
  }

  if (getInstalledRepos.isError) {
    return <ErrorAlert message="Error loading your Github integration" />;
  }

  if (!getInstalledRepos.data || getInstalledRepos.data.length === 0) {
    return <ErrorAlert message="You need to setup your integration!" />;
  }

  const activeRepos = getInstalledRepos.data.filter((item) => item.is_active);

  if (activeRepos.length < 1) {
    return (
      <InfoAlert
        message="No repositories enabled yet"
        subMessage={
          <>
            Configure your repositories{" "}
            <span
              className="underline cursor-pointer underline-offset-2"
              onClick={onEdit}
            >
              here
            </span>
          </>
        }
      />
    );
  }

  return (
    <div>
      <ul className="space-y-2">
        {activeRepos.map((repo) => (
          <li key={repo.id}>{repo.repository_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrgView;

export const getServerSideProps = withPageAuth<"public">({
  getServerSideProps: baseGetServerSideProps,
});

export async function baseGetServerSideProps(
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
  supabaseClient: SupabaseClient,
) {
  const accountId = flattenParam(ctx.params?.["accountId"]);
  const page = flattenParam(ctx.params?.["page"]);

  if (!accountId) {
    return {
      notFound: true,
      props: {},
    };
  }

  const { data: organization, error } = await supabaseClient
    .from("organizations")
    .select("*")
    .eq("account_id", accountId)
    .limit(1)
    .single();

  if (error) {
    console.error(
      "Got error getting organization by account ID ",
      accountId,
      ": ",
      error,
    );
    return {
      notFound: true,
      props: {},
    };
  }

  return { props: { organization, page } };
}