import type { Endpoints } from "@octokit/types";

export type IssueType = Endpoints["GET /issues"]["response"]["data"][number];
export type RepoType =
  Endpoints["GET /users/{username}/repos"]["response"]["data"][number];
