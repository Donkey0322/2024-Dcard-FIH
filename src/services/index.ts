"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Octokit } from "octokit";

import type { MySession } from "@/app/api/auth/[...nextauth]/auth";
import type { AuthOptions } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";

export default async function authorizeInstance() {
  const session = await getServerSession<AuthOptions, MySession>(authOptions);
  if (!session) {
    redirect("/");
  }
  const octokit = new Octokit({
    auth: session?.accessToken,
  });

  return octokit;
}
