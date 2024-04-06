import GithubProvider from "next-auth/providers/github";

import type { AuthOptions, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export interface MySession extends Session {
  accessToken: string;
  username: string;
}

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.OAUTH_CLIENT_ID ?? "",
      clientSecret: process.env.OAUTH_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    session: function ({ session, token }: { session: Session; token: JWT }) {
      return {
        ...session,
        accessToken: token.accessToken,
        username: token.username,
      };
    },
    jwt: function ({ token, account, profile }) {
      if (profile) token.username = (profile as { login: string }).login;
      if (account) token.accessToken = account.access_token;
      return token;
    },
  },
};
