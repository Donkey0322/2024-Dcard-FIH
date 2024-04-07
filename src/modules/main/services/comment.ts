"use server";

import type { FetchIssueBasis } from ".";

import authorizeInstance from "@/services";

export async function getComments({ repo, owner, issue }: FetchIssueBasis) {
  try {
    const { octokit, user } = await authorizeInstance();
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner: owner ?? user ?? "",
        repo,
        issue_number: issue,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
}
