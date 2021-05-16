import { Command, flags } from "@oclif/command";
import * as path from "path";
import * as fsp from "fs/promises";
import { accessCheck } from "../accessCheck";
import chalk = require("chalk");

export default class Doctor extends Command {
  static description = `"doctor" will run permission and other checks on the Git Graft Hook.`;

  static flags = {
    help: flags.help({ char: "h" }),
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(Doctor);
    try {
      const pathToHook = path.join(process.cwd(), "./.git/hooks/commit-msg");
      const actualPath = await fsp.realpath(pathToHook);
      this.log(
        "Directory should have 'commit-msg': ",
        await fsp.readdir(path.join(process.cwd(), "./.git/hooks/"))
      );
      this.log("Filepath: ", actualPath);
      accessCheck(pathToHook);
    } catch (e) {
      this.log(chalk.white("Error During Checks: "), chalk.red(e));
      this.log(
        chalk.red("Re-Attempt Access change by passing in FilePath & --force")
      );
      if (args.name && flags.force) {
        accessCheck(args.name);
      }
    }
  }
}
