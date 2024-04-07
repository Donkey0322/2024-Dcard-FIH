import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import type { MySession } from "@/app/api/auth/[...nextauth]/auth";
import type { AuthOptions } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import Header from "@/modules/main/components/Header";
import PostList from "@/modules/main/pages/PostList";
import { getIssues, getRepos, getUser } from "@/modules/main/services";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getServerSession<AuthOptions, MySession>(authOptions);
  if (!session) redirect("/");

  const currentPage = Number(searchParams?.page) || 1;
  const [owner, repo] = (searchParams.repo as `${string}/${string}`)?.split(
    "/"
  ) ?? [undefined, undefined];
  const state = searchParams.state ? String(searchParams.state) : "open";
  const issues = await getIssues(
    currentPage,
    repo ? { name: repo, owner } : undefined,
    state
  );
  const repos = await getRepos();
  console.log(issues.length);
  const user = await getUser();

  return (
    <>
      <Header user={user} />
      <PostList issues={issues} filters={{ repos }} />
    </>
  );
}
