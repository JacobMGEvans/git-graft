#!/usr/bin/env node

import fs = require("fs");
import util = require("util");
const childProcessExec = require("child_process").exec;

const BRANCH_CONTRACT = /^(feature|hotfix)\/AP-[0-9]{1,6}-/;
const CODE_CONTRACT = /AP-[0-9]{1,6}-/;
const TIMEOUT_THRESHOLD = 3000;

const exec = util.promisify(childProcessExec);

checkCommitMessage();
hookCleanup();

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
  return branches
    .split("\n")
    .find((b: string) => b.trim().charAt(0) === "*")
    .trim()
    .substring(2);
}

function handleGitBranchCommandError(e: any) {
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

function hookCleanup() {
  setTimeout(() => {
    console.log(
      "This is a timeout message from your commit-msg git hook. If you see this, something bad happened in your pre-commit hook, and it absolutely did not work as expected."
    );
    console.log(
      " Your commit will be rejected. Please read any previous error message related to your commit message, and/or check the commit-msg git hook script."
    );
    console.log(
      " You can find more info in this link: https://git-scm.com/book/uz/v2/Customizing-Git-An-Example-Git-Enforced-Policy"
    );
    process.exit(1);
  }, TIMEOUT_THRESHOLD);
}
