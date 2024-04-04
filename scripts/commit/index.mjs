import { exec } from "child_process";
import fs from "fs";
import inquirer from "inquirer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const confirm =
  (gitMessage) =>
  ({ check }) => {
    if (check)
      exec(`git commit -m "${gitMessage}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          if (!stderr.includes("match any configured task"))
            console.log(stderr);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
  };

const logPath = "scripts/commit/commit.txt";

const argv = yargs(hideBin(process.argv)).argv;

if (argv.l) {
  fs.readFile(logPath, "utf8", function (err, data) {
    if (err) throw err;
    console.log(data);
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "check",
          message: "Press enter to proceed",
          default: true,
        },
      ])
      .then(confirm(data));
  });
} else
  inquirer
    .prompt([
      {
        type: "list",
        name: "type",
        message: "Your commit type:",
        choices: ["feat", "fix", "chore", "doc", "style", "refactor", "perf"],
      },
      {
        type: "input",
        name: "scope",
        message: "The scope your commit for:",
      },
      {
        type: "input",
        name: "message",
        message: "Your commit message:",
      },
    ])
    .then(({ scope, message, type }) => {
      const gitMessage = type + (scope ? `(${scope})` : "") + `: ${message}`;
      fs.writeFile(logPath, gitMessage, (err) => {
        if (err) throw err;
      });
      console.log(gitMessage);
      inquirer
        .prompt([
          {
            type: "confirm",
            name: "check",
            message: "Press enter to proceed",
            default: true,
          },
        ])
        .then(confirm(gitMessage));
    });
