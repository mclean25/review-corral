import { FC } from "react";
import { ErrorAlert } from "../../../components/common/alerts/Error";
import { InfoAlert } from "../../../components/common/alerts/Info";
import { useGetInstallationRepos } from "../../../components/organization/github/useGetInstallationRepos";
import { Github } from "../../assets/icons/Github";
import { Organization } from "../shared";

interface GithubCardProps {
  organization: Organization;
  onEdit: () => void;
}

export const GithubCard: FC<GithubCardProps> = ({ organization, onEdit }) => {
  return (
    <div id="github">
      <div className="flex py-4 border-b border-gray-300 rounded-t-md justify-between items-center w-96">
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
      <div className="py-6">
        <GithubCardData organization={organization} onEdit={onEdit} />
      </div>
    </div>
  );
};

interface GithubCardDataProps {
  organization: Organization;
  onEdit: () => void;
}

const GithubCardData: FC<GithubCardDataProps> = ({ organization, onEdit }) => {
  const getInstalledRepos = useGetInstallationRepos(
    organization.installation_id,
  );

  if (getInstalledRepos.isLoading) {
    return (
      <div>
        <div className="space-y-4">
          {Array.from(Array(3).keys()).map((num) => (
            <div
              key={num}
              className="h-6 w-full rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </div>
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
            Configure your repositories&nbsp;
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
      <div className="space-y-2">
        {activeRepos.map((repo) => (
          <div className="border border-gray-200 rounded-md p-4" key={repo.id}>
            {repo.repository_name}
          </div>
        ))}
      </div>
    </div>
  );
};
