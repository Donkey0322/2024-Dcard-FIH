import { spawn } from "child_process";
import loadEnv from "../envs/loadEnv.js";

var ls;

if (process.argv.includes("-p")) {
  loadEnv("production");
} else if (process.argv.includes("-s")) {
  loadEnv("staging");
} else {
  loadEnv("development");
}

if (process.argv.includes("build")) {
  ls = spawn(`pnpm`, ["next", "build"]);
} else if (process.argv.includes("start")) {
  ls = spawn(`pnpm`, ["next", "start"]);
} else {
  ls = spawn(`pnpm`, ["next", "dev"]);
}

ls.on("exit", () => {
  console.log(`Done`);
});

ls.stdout.on("data", (output) => {
  console.log(`${output}`);
});

ls.stdout.on("error", (error) => {
  console.log(`❌ ${error}`);
});

ls.stderr.on("data", (data) => {
  console.log(`stderr: ${data}`);
});
