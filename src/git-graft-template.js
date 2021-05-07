#!/usr/bin/env node

const fs = require("fs");
const util = require("util");
const gitGraftConfig = require("../git-graft.json"); //TODO this needs to dynamically find the root of the project
const childProcessExec = require("child_process").exec;

const BRANCH_TYPES = RegExp(gitGraftConfig.branchTypes); // Get from config
const BRANCH_CONTRACT = RegExp(
  `${BRANCH_TYPES}${gitGraftConfig.branchPattern}`
); // Get from config
const CODE_CONTRACT = RegExp(gitGraftConfig.branchPattern); // Get from config

const TIMEOUT_THRESHOLD = 3000;

const exec = util.promisify(childProcessExec);

checkCommitMessage();
hookEscapeHatch(); // Turn this into a bypass with a flag

async function checkCommitMessage() {
  const message = fs.readFileSync(process.argv[2], "utf8").trim();
  let branchName = "";
  try {
    branchName = await getCurrentBranch();
  } catch (e) {
    handleGitBranchCommandError(e);
  }

  if (!BRANCH_CONTRACT.test(branchName)) {
    handleBadBranchName();
  }

  if (!CODE_CONTRACT.test(message)) {
    handleBadCommitMessage();
  }
  process.exit(0);
}

async function getCurrentBranch() {
  const branchesOutput = await exec("git branch");
  if (branchesOutput.stderr) {
    throw new Error(branchesOutput.stderr);
  }
  const branches = branchesOutput.stdout;
  console.log(branches, "BRANCHES");
  return branches
    .split("\n")
    .find((str) => str.trim().charAt(0) === "*")
    .trim()
    .substring(2);
}

function handleGitBranchCommandError(e) {
  console.log('Error executing "git branch" command');
  console.log(e.getMessage());
  console.log("----");
  console.log("Your commit will be rejected. This script will terminate.");
  process.exit(1);
}

function handleBadBranchName() {
  console.log("There is something wrong with your branch name");
  console.log(
    "branch names in this project must adhere to this contract:" +
      BRANCH_CONTRACT
  );
  console.log(
    "Your commit will be rejected. You should rename your branch to a valid name, based on your configurations check git-graft.json"
  );
  process.exit(1);
}

function handleBadCommitMessage() {
  console.log("There is something wrong with your commit message");
  console.log(
    "it should start with a valid Jira issue code, followed by a dash, thus adhering to this contract:" +
      CODE_CONTRACT
  );
  console.log(
    "your commit will be rejected. Please re-commit your work again with a proper commit message."
  );
  process.exit(1);
}

function hookEscapeHatch() {
  setTimeout(() => {
    console.log(
      "Git Graft Hook Timeout. If you see this, something bad happened in your pre-commit hook."
    );
    console.log(" Your commit will be rejected.");
    process.exit(1);
  }, TIMEOUT_THRESHOLD);
}
