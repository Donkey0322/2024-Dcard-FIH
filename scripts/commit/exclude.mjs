import sgf from "staged-git-files";

export async function exclude() {
  const results = await sgf();
  if (results.some(({ filename }) => filename === "src/test/index.ts")) {
    throw new Error("⛔️ Please don't commit src/test/index.ts");
  }
}
