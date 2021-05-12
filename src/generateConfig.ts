import { prompt } from "enquirer";
import * as path from "path";
import * as fsp from "fs/promises";

type branchTypes = { branchTypes: string };
type ticketTypes = { ticketTypes: string };
type branchPattern = { branchPattern: string };
type ticketOnly = { ticketOnly: boolean };

export async function generateConfig() {
  // TODO: Convert into one Form enquirer prompt
  const branchTypes: branchTypes = await prompt({
    type: "input",
    name: "branchTypes",
    initial: "feature testing hotfix bugfix",
    message: "Branch Gitflow types to include?",
  });
  const ticketTypes: ticketTypes = await prompt({
    type: "input",
    name: "ticketTypes",
    initial: "ZZ",
    message: "Ticket code?",
  });
  const branchPattern: branchPattern = await prompt({
    type: "input",
    name: "branchPattern",
    initial: "ExampleCode-[0-9]{1,6}-.*",
    message: "RegEx Pattern to match branches?",
  });
  const ticketOnly: ticketOnly = await prompt({
    type: "confirm",
    name: "ticketOnly",
    message: "Only prepend Ticket Type & Code",
  });

  const outConfig = path.join(process.cwd(), "./git-graft.json");
  await fsp.writeFile(
    outConfig,
    JSON.stringify(
      { ...branchTypes, ...ticketTypes, ...branchPattern, ...ticketOnly },
      null,
      2
    )
  );

  return outConfig;
}
