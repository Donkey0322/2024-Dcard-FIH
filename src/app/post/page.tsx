/* eslint-disable @typescript-eslint/no-unsafe-return */
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import type { MySession } from "@/app/api/auth/[...nextauth]/auth";
import type { AuthOptions } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import Gallery from "@/modules/main/components/Gallery";
import Header from "@/modules/main/components/Header";
import { getIssues } from "@/modules/main/components/services";

export default async function Home() {
  const session = await getServerSession<AuthOptions, MySession>(authOptions);
  const data = await getIssues();
  if (!session) redirect("/");

  return (
    <>
      <Header name={session?.user?.name} />
      <Gallery issues={data} />
    </>
  );
}
