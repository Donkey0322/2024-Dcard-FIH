import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Contrail_One } from "next/font/google";
import { getServerSession } from "next-auth";

import type { MySession } from "@/app/api/auth/[...nextauth]/auth";
import type { Metadata } from "next";
import type { AuthOptions } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import StyledComponentsRegistry from "@/libs/styled-components";
import SessionProvider from "@/providers/session";
import ThemeProvider from "@/providers/theme";

import "@/app/globals.css";

const font = Contrail_One({
  weight: "400",
  variable: "--contrail-one",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dcard FIH 2024",
  description: "The application built in Next for Dcard frontend intern 2024",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession<AuthOptions, MySession>(authOptions);

  return (
    <html lang="en">
      <body className={font.variable}>
        <StyledComponentsRegistry>
          <AntdRegistry>
            <SessionProvider session={session}>
              <ThemeProvider>{children}</ThemeProvider>
            </SessionProvider>
          </AntdRegistry>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
