"use client";

import { SessionProvider } from "next-auth/react";

import type { MySession } from "@/app/api/auth/[...nextauth]/auth";

export default function Provider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: MySession | null;
}): React.ReactNode {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
