import type { Endpoints } from "@octokit/types";

export type IssueType = Endpoints["GET /issues"]["response"]["data"][number];

export type RepoType = Endpoints["GET /user/repos"]["response"]["data"][number];

export type CommentType =
  Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"]["response"]["data"][number];

export type UserType = Endpoints["GET /users/{username}"]["response"]["data"];
