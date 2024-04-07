"use server";

import authorizeInstance, { headers } from "@/services";

export async function getRepos() {
  try {
    const { octokit, user } = await authorizeInstance();
    if (user) {
      const { data } = await octokit.request("GET /user/repos", {
        headers,
      });
      return data;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
}

export async function getUser() {
  try {
    const { octokit, user } = await authorizeInstance();
    if (user) {
      const { data } = await octokit.request("GET /users/{username}", {
        username: user,
        headers,
      });
      return data;
    }
    return undefined;
  } catch (error) {}
}
