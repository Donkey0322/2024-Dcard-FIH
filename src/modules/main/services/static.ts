"use server";

import { getServerSession } from "next-auth";

import type { MySession } from "@/app/api/auth/[...nextauth]/auth";
import type { AuthOptions } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import authorizeInstance from "@/services";

export async function getRepos() {
  try {
    const session = await getServerSession<AuthOptions, MySession>(authOptions);
    const octokit = await authorizeInstance();

    if (session?.username) {
      const { data } = await octokit.request("GET /users/{username}/repos", {
        username: session.username ?? "",
        type: "all",
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      return data;
    }

    return undefined;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}
