"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import type { MySession } from "@/app/api/auth/[...nextauth]/auth";
import type { IssueType } from "@/modules/main/types";
import type { AuthOptions } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { FETCH_ISSUE_ONETIME_NUMBER } from "@/constants/issue";
import authorizeInstance, { headers } from "@/services";

export interface FetchIssueBasis {
  repo: string;
  issue: number;
  owner?: string;
}

interface CreateIssueBasis {
  repo: string;
  title: string;
  body?: string;
}

export async function getIssues(
  page = 1,
  repo?: { owner: string; name: string },
  state = "open"
) {
  try {
    const session = await getServerSession<AuthOptions, MySession>(authOptions);
    if (!session) {
      redirect("/");
    }
    const Header = {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${session?.accessToken}`,
      ...headers,
    };

    let result: IssueType[] = [];

    for (let p = 0; p < Math.ceil(page / 10); p++) {
      const params = `per_page=${
        FETCH_ISSUE_ONETIME_NUMBER *
        Math.min(page - p * FETCH_ISSUE_ONETIME_NUMBER, 10)
      }&page=${p + 1}&state=${state}`;

      const data: IssueType[] = await fetch(
        repo
          ? `https://api.github.com/repos/${repo.owner}/${repo.name}/issues?${params}`
          : `https://api.github.com/issues?filter=all&${params}`,
        {
          headers: Header,
          next: { tags: ["issues", "get"] },
        }
      ).then((response) => response.json() as Promise<IssueType[]>);
      result = [...result, ...data];
    }
    return result;
  } catch (error) {
    return [];
  }
}

export async function updateIssue({
  repo,
  owner,
  issue,
  title,
  body,
}: FetchIssueBasis & { title: string; body?: string }) {
  try {
    const { octokit, user } = await authorizeInstance();
    await octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
      owner: owner ?? user ?? "",
      repo,
      issue_number: issue,
      title,
      body,
      headers,
    });
    revalidateTag("issues");
  } catch {
    return undefined;
  }
}

export async function updateIssueState(
  { repo, owner, issue }: FetchIssueBasis,
  state: "closed" | "open" = "closed"
) {
  try {
    const { octokit, user } = await authorizeInstance();
    await octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
      owner: owner ?? user ?? "",
      repo,
      issue_number: issue,
      state,
      headers,
    });
    revalidateTag("issues");
  } catch {
    return undefined;
  }
}

export async function createIssue({ repo, title, body }: CreateIssueBasis) {
  try {
    const { octokit, user } = await authorizeInstance();
    await octokit.request("POST /repos/{owner}/{repo}/issues", {
      owner: user ?? "",
      repo,
      title,
      body,
      headers,
    });
    revalidateTag("issues");
  } catch {
    return undefined;
  }
}
