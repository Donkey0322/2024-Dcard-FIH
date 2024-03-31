import GithubProvider from "next-auth/providers/github";

import type { Account, AuthOptions, Session, User } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";

export interface MySession extends Session {
  accessToken: string;
}

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.OAUTH_CLIENT_ID ?? "",
      clientSecret: process.env.OAUTH_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    session: function ({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
      user: AdapterUser;
    }) {
      return { ...session, accessToken: token.accessToken };
    },
    jwt: function ({
      token,
      user,
      account,
    }: {
      token: JWT;
      user: User;
      account: Account | null;
    }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};
