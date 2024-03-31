/* eslint-disable @typescript-eslint/no-unsafe-return */
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Octokit } from "octokit";

import type { MySession } from "@/app/api/auth/[...nextauth]/auth";
import type { AuthOptions } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import Gallery from "@/modules/main/components/Gallery";
import Header from "@/modules/main/components/Header";

async function getData() {
  try {
    const session = await getServerSession<AuthOptions, MySession>(authOptions);
    if (!session) {
      redirect("/");
    }
    const octokit = new Octokit({
      auth: session?.accessToken,
    });

    const res = await octokit.request("GET /issues", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      filter: "all",
    });
    // if (!res.data) {
    //   // This will activate the closest `error.js` Error Boundary
    //   throw new Error("Failed to fetch data");
    // }

    return res.data;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

export default async function Home() {
  const session = await getServerSession<AuthOptions, MySession>(authOptions);
  const data = await getData();
  if (!session) redirect("/");

  return (
    <>
      <Header name={session?.user?.name} />
      <Gallery issues={data} />
    </>
  );
}
