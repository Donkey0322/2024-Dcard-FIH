import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import type { MySession } from "@/app/api/auth/[...nextauth]/auth";
import type { AuthOptions } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import Gallery from "@/modules/main/components/Gallery";
import Header from "@/modules/main/components/Header";
import { getIssues } from "@/modules/main/services";

export default async function Home({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const session = await getServerSession<AuthOptions, MySession>(authOptions);
  if (!session) redirect("/");

  const currentPage = Number(searchParams?.page) || 1;
  const data = await getIssues(currentPage);

  return (
    <>
      <Header name={session?.user?.name} />
      <Gallery issues={data} />
    </>
  );
}
