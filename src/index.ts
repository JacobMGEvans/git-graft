import { Command, flags } from "@oclif/command";
import { prompt } from "enquirer";
import * as path from "path";
import * as fsp from "fs/promises";
import { accessCheck } from "./accessCheck";
import { constants } from "fs";
const { X_OK } = constants;

class GitGraft extends Command {
  static description =
    "init will prompt for configuration inputs for the git hook, then generate git-graft.json and git hook file. ";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "init" }];

  async run() {
    const { args } = this.parse(GitGraft);
    if (args.init) {
      const branchTypes = await prompt({
        type: "input",
        name: "branchTypes",
        initial: "feature testing hotfix bugfix",
        message: "Branch Gitflow types to include?",
      });
      const branchPattern = await prompt({
        type: "input",
        name: "branchPattern",
        initial: "ExampleCode-[0-9]{1,6}-.*",
        message: "RegEx Pattern to match branches?",
      });

      const inDir = path.resolve(__dirname, "../templates/git-graft-template");
      const outDir = path.join(process.cwd(), "./.git/hooks/commit-msg");

      await fsp.writeFile(
        "./git-graft.json",
        JSON.stringify({ ...branchTypes, ...branchPattern }, null, 2)
      );

      await fsp.copyFile(inDir, outDir);
      this.log("Git Graft Hook Generation Complete.");

      const currPermission = await accessCheck(outDir);

      this.log("Current Git Graft Hook Permissions: ", currPermission);

      if (currPermission === "Access Denied") {
        prompt({
          type: "confirm",
          name: "permit",
          message:
            "Git Graft needs execution permissions, would you like to proceed?",
        }).then(async (answer: any) => {
          if (answer.permit) {
            fsp.chmod(outDir, "774");
            this.log(
              "Git Graft Updated Permissions: ",
              await accessCheck(outDir)
            );
          }
        });
      }
    }
  }
}

export = GitGraft;
