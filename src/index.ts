import { Command, flags } from "@oclif/command";
import { prompt } from "enquirer";
import * as chalk from "chalk";
import * as ora from "ora";
import * as path from "path";
import * as fsp from "fs/promises";
import { accessCheck } from "./accessCheck";
import { generateConfig } from "./generateConfig";

class GitGraft extends Command {
  static description =
    "CLI tool that generates a configurable Git Hook that prepends branch name patterns to commit messages.";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
  };

  static args = [
    {
      name: "init",
      description:
        "init will prompt for configuration inputs, then generate git-graft.json and the Git Hook file. ",
    },
  ];

  async run() {
    const { args } = this.parse(GitGraft);
    const spinner = ora();

    if (args.init) {
      const zeroConfig: { result: boolean } = await prompt({
        type: "confirm",
        name: "result",
        message: `${chalk.bold.white(
          "Would you like to utilize Zero Config"
        )} \n This will make assumptions about your Gitflow DevOps i.e. feature/Ticket-####-description`,
      });

      let outConfig: string;
      if (!zeroConfig.result) {
        outConfig = await generateConfig();
      }

      const inDir = path.resolve(__dirname, "./templates/git-graft-template");
      const outDir = path.join(process.cwd(), "./.git/hooks/commit-msg");

      await fsp.copyFile(inDir, outDir);

      const currPermission = await accessCheck(outDir);

      this.log(
        "Git Graft Hook Permissions: ",
        chalk.bold.yellowBright(currPermission)
      );

      if (currPermission === "Access Denied") {
        prompt({
          type: "confirm",
          name: "permit",
          message: `${chalk.bold.white(
            "Git Graft needs execution permissions."
          )} \n Would you like to proceed?`,
        }).then(async (answer: any) => {
          if (answer.permit) {
            fsp.chmod(outDir, "774");
            this.log(
              "Git Graft Updated Permissions: ",
              chalk.bold.green(await accessCheck(outDir))
            );
          } else {
            await fsp.rm(outDir);
            outConfig && (await fsp.rm(outConfig));

            this.log(
              chalk.bold.redBright(
                "Git Graft Hook Generation Aborted. Generated Files Removed."
              )
            );
            process.exit(0);
          }
        });
      }
    }
  }
}

export = GitGraft;
