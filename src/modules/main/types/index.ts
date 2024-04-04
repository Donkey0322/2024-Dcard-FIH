import type { Endpoints } from "@octokit/types";

export type IssueType = Endpoints["GET /issues"]["response"]["data"][number];
