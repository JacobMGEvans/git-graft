# git-graft

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/git-graft.svg)](https://npmjs.org/package/git-graft)
[![Downloads/week](https://img.shields.io/npm/dw/git-graft.svg)](https://npmjs.org/package/git-graft)
[![License](https://img.shields.io/npm/l/git-graft.svg)](https://github.com/JacobMGEvans/git-graft/blob/master/package.json)

CLI tool that generates a configurable Git Hook that prepends branch name patterns to commit messages.

Features:

- Generated Git Hook
- Node bin file running JS and has no dependencies
- Configurable [git-graft.json](#configuration)
- Validates the commit message and branch
- [Usage](#usage)
- [Commands](#commands)

# Usage

```sh-session
$ npx git-graft (-v|--version|version)
git-graft/0.0.0 linux-x64 node-v14.16.1
$ npx git-graft --help
Main Usage
  $npx git-graft [COMMAND]
...
```

# Commands

## **Init**

Git Graft currently only has one command for generating the Git Hook and configuration file.

**example:**
`npx git-graft init`

The prompts will be used to construct the [configuration](#configuration) file and ask to modify permissions to allow for execution of the generated Git Hook. Without permission to execute the Git Hook cannot work.

## TBD:

**Doctor**

- Will run permissions check on Git Graft Hook
- Will run unit tests on Git Graft Hook code

# Configuration

The [init](#init) generates a `git-graft.json` that has properties for a configurable Git Hook. Configuration the patterns to validate the branch and resulting prepended commit message with branch information.

**branchTypes:**

`RegExp List` _required_ -- Refers to GitFlows from DevOps best practices. Git Graft Hook will wrap the list in `()` and the constructor includes the forward slash & escape `\/` [example](#regex-examples)

**branchPattern:**

`RegExp` _required_ -- Refers to the code/ticket and name of the branch following the branchType. [example](#regex-examples)

**ticketTypes:**

`string` _required_ -- Refers to the ticket code types, for example JIRA will use TICKETTYPE-{NUMBERS}. The Git Hook will use this config to construct a `RegExp` for the prepending to commit messages.

**regExFlag:**

`RegExp` _optional_ -- Flags to pass into RegEx constructors. Default: `gim`

**ticketOnly:**

`boolean` _optional_ -- Used to determine if ticket/code or whole branch should used. Default: `true`

---

### RegEx Examples:

#### branchPattern - https://regex101.com/r/ewym8B/1

#### branchTypes - https://regex101.com/r/KNZio4/1
