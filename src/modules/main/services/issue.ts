"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import type { MySession } from "@/app/api/auth/[...nextauth]/auth";
import type { IssueType } from "@/modules/main/types";
import type { AuthOptions } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { FETCH_ISSUE_ONETIME_NUMBER } from "@/constants/issue";
import authorizeInstance from "@/services";

interface FetchIssueBasis {
  repo: string;
  owner: string;
  issue: number;
}

interface CreateIssueBasis {
  repo: string;
  title: string;
  body?: string;
}

export async function getIssues(page = 1, repo?: string) {
  try {
    const session = await getServerSession<AuthOptions, MySession>(authOptions);
    if (!session) {
      redirect("/");
    }
    // const octokit = new Octokit({
    //   auth: session?.accessToken,
    // });

    // const res = await octokit.request("GET /issues", {
    //   headers: {
    //     "X-GitHub-Api-Version": "2022-11-28",
    //   },
    //   filter: "all",
    // });
    if (repo) {
      const data: IssueType[] = await fetch(
        `https://api.github.com/repos/${
          session.username
        }/${repo}/issues?filter=repo&per_page=${
          FETCH_ISSUE_ONETIME_NUMBER * page
        }`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${session?.accessToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
          next: { tags: ["issues", "get"] },
        }
      ).then((response) => response.json() as Promise<IssueType[]>);
      return data;
    }

    const data: IssueType[] = await fetch(
      `https://api.github.com/issues?filter=all&per_page=${
        FETCH_ISSUE_ONETIME_NUMBER * page
      }`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${session?.accessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { tags: ["issues", "get"] },
      }
    ).then((response) => response.json() as Promise<IssueType[]>);
    return data;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export async function getIssue({ repo, owner, issue }: FetchIssueBasis) {
  try {
    const octokit = await authorizeInstance();
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/issues/{issue_number}",
      {
        owner,
        repo,
        issue_number: issue,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return data;
  } catch (error) {
    console.log(error);
    return undefined;
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
    const octokit = await authorizeInstance();
    await octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
      owner,
      repo,
      issue_number: issue,
      title,
      body,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    revalidateTag("issues");
  } catch (error) {
    console.log(error);
  }
}

export async function closeIssue({ repo, owner, issue }: FetchIssueBasis) {
  try {
    const octokit = await authorizeInstance();
    await octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
      owner,
      repo,
      issue_number: issue,
      state: "closed",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    revalidateTag("issues");
  } catch (error) {
    console.log(error);
  }
}

export async function createIssue({ repo, title, body }: CreateIssueBasis) {
  try {
    const session = await getServerSession<AuthOptions, MySession>(authOptions);

    const octokit = await authorizeInstance();
    await octokit.request("POST /repos/{owner}/{repo}/issues", {
      owner: session?.username ?? "",
      repo,
      title,
      body,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    revalidateTag("issues");
  } catch (error) {
    console.log(error);
  }
}
