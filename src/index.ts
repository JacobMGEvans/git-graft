import { Command, flags } from "@oclif/command";
import { prompt } from "enquirer";
import * as fsp from "fs/promises";

//? Maybe how I want to get root of projects
// var path = require('path');
// global.appRoot = path.resolve(__dirname);

class GitGraft extends Command {
  static description =
    "init will prompt for configuration inputs for the git hook, then generate git-graft.json and git hook file. ";

  static flags = {
    // add --version flag to show CLI version
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
        initial: "EXAMPLE-[0-9]{1,6}-",
        message: "RegEx Pattern to match branches?",
      });

      await fsp.writeFile(
        "./git-graft.json",
        JSON.stringify({ ...branchTypes, ...branchPattern }, null, 2)
      );

      await fsp
        .readFile(`${__dirname}/git-graft-template.js`)
        .then((file) =>
          fsp.writeFile(`${__dirname}/.git/hooks/commit-msg`, file)
        );
      // fsp.chmod("./git-graft.json", 774);
    }
  }
}

export = GitGraft;
