"use server";

/* eslint-disable @typescript-eslint/no-unsafe-return */
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Octokit } from "octokit";

import type { MySession } from "@/app/api/auth/[...nextauth]/auth";
import type { Endpoints } from "@octokit/types";
import type { AuthOptions } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export const getIssues = async () => {
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

    const data: Endpoints["GET /issues"]["response"]["data"] = await fetch(
      "https://api.github.com/issues?filter=all&per_page=10",
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${session?.accessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { tags: ["issues", "get"] },
      }
    ).then((response) => response.json());

    return data;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export async function closeIssue({
  repo,
  owner,
  issue,
}: {
  repo: string;
  owner: string;
  issue: number;
}) {
  try {
    const session = await getServerSession<AuthOptions, MySession>(authOptions);
    if (!session) {
      redirect("/");
    }
    const octokit = new Octokit({
      auth: session?.accessToken,
    });
    console.log(session?.accessToken);

    await octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
      owner: owner,
      repo: repo,
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
