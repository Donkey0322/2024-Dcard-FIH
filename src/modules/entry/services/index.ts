import { signIn } from "next-auth/react";

export const signInGithub = async () => {
  try {
    await signIn("github", { callbackUrl: "/post" });
  } catch (error) {
    console.log(error);
  }
};
