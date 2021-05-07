import { Command, flags } from "@oclif/command";
import { prompt } from "enquirer";

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
      const response = await prompt({
        type: "input",
        name: "Branches",
        initial: "main staging testing",
        message: "Branches the graft should ignore?",
      });

      this.log(response);
    }
  }
}

export = GitGraft;
