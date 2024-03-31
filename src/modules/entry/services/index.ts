import { signIn } from "next-auth/react";

export const signInGithub = async () => {
  try {
    await signIn("github", { callbackUrl: "http://localhost:3000/post" });
  } catch (error) {
    console.log(error);
  }
};
