export interface GithubEvent {
  action: GithubAction | any;
  number: number;
  comment?: Comment;
  review?: Review;
  pull_request: PullRequest;
  repository: Repository;
  sender: OwnerOrUserOrSender;
  installation: Installation;
  requested_reviewer?: ReviewRequested;
}

export interface ReviewRequested {
  login: string;
}

export type GithubAction =
  | "closed"
  | "opened"
  | "reopened"
  | "submitted"
  | "converted_to_draft"
  | "ready_for_review"
  | "review_requested";

export const GithubActions: GithubAction[] = [
  "closed",
  "opened",
  "reopened",
  "submitted",
  "converted_to_draft",
  "ready_for_review",
  "review_requested",
];

export interface PullRequest {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  number: number;
  state: string;
  locked: boolean;
  title: string;
  user: OwnerOrUserOrSender;
  body?: null;
  created_at: string;
  updated_at: string;
  closed_at: string;
  merged_at?: null;
  merge_commit_sha: string;
  assignee?: null;
  assignees?: null[] | null;
  requested_reviewers?: null[] | null;
  requested_teams?: null[] | null;
  labels?: null[] | null;
  milestone?: null;
  draft: boolean;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  head: HeadOrBase;
  base: HeadOrBase;
  _links: Links;
  author_association: string;
  auto_merge?: null;
  active_lock_reason?: null;
  merged: boolean;
  mergeable: boolean;
  rebaseable: boolean;
  mergeable_state: string;
  merged_by?: null;
  comments: number;
  review_comments: number;
  maintainer_can_modify: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

export interface Review {
  id: number;
  node_id: string;
  user: OwnerOrUserOrSender;
  body: string;
  commit_id: string;
  submitted_at: string;
  state: "changes_requested" | "commented" | "approved";
  html_url: string;
  pull_request_url: string;
  author_association: string;
  _links: Links;
}

export interface OwnerOrUserOrSender {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}
export interface HeadOrBase {
  label: string;
  ref: string;
  sha: string;
  user: OwnerOrUserOrSender;
  repo: Repo;
}
export interface Repo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: OwnerOrUserOrSender;
  html_url: string;
  description?: null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage?: null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url?: null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license?: null;
  allow_forking: boolean;
  is_template: boolean;
  topics?: null[] | null;
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  allow_squash_merge: boolean;
  allow_merge_commit: boolean;
  allow_rebase_merge: boolean;
  allow_auto_merge: boolean;
  delete_branch_on_merge: boolean;
  allow_update_branch: boolean;
}
export interface Links {
  self: SelfOrHtmlOrIssueOrCommentsOrReviewCommentsOrReviewCommentOrCommitsOrStatuses;
  html: SelfOrHtmlOrIssueOrCommentsOrReviewCommentsOrReviewCommentOrCommitsOrStatuses;
  issue: SelfOrHtmlOrIssueOrCommentsOrReviewCommentsOrReviewCommentOrCommitsOrStatuses;
  comments: SelfOrHtmlOrIssueOrCommentsOrReviewCommentsOrReviewCommentOrCommitsOrStatuses;
  review_comments: SelfOrHtmlOrIssueOrCommentsOrReviewCommentsOrReviewCommentOrCommitsOrStatuses;
  review_comment: SelfOrHtmlOrIssueOrCommentsOrReviewCommentsOrReviewCommentOrCommitsOrStatuses;
  commits: SelfOrHtmlOrIssueOrCommentsOrReviewCommentsOrReviewCommentOrCommitsOrStatuses;
  statuses: SelfOrHtmlOrIssueOrCommentsOrReviewCommentsOrReviewCommentOrCommitsOrStatuses;
}
export interface SelfOrHtmlOrIssueOrCommentsOrReviewCommentsOrReviewCommentOrCommitsOrStatuses {
  href: string;
}
export interface Repository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: OwnerOrUserOrSender;
  html_url: string;
  description?: null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage?: null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url?: null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license?: null;
  allow_forking: boolean;
  is_template: boolean;
  topics?: null[] | null;
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
}
export interface Installation {
  id: number;
  node_id: string;
}

export interface Weather {
  action: string;
  comment: Comment;
  pull_request: PullRequest;
  repository: Repository;
  sender: UserOrOwnerOrSender;
  installation: Installation;
}
export interface Comment {
  url: string;
  pull_request_review_id: number;
  id: number;
  node_id: string;
  diff_hunk: string;
  path: string;
  position: number;
  original_position: number;
  commit_id: string;
  original_commit_id: string;
  user: UserOrOwnerOrSender;
  body: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  pull_request_url: string;
  author_association: string;
  _links: Links;
  reactions: Reactions;
  start_line?: null;
  original_start_line?: null;
  start_side?: null;
  line: number;
  original_line: number;
  side: string;
  in_reply_to_id: number;
}
export interface UserOrOwnerOrSender {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}
export interface Reactions {
  url: string;
  total_count: number;
}