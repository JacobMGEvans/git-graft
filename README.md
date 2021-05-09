# git-graft

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/git-graft.svg)](https://npmjs.org/package/git-graft)
[![Downloads/week](https://img.shields.io/npm/dw/git-graft.svg)](https://npmjs.org/package/git-graft)
[![License](https://img.shields.io/npm/l/git-graft.svg)](https://github.com/JacobMGEvans/git-graft/blob/master/package.json)

CLI tool that generates a configurable Git Hook that prepends branch name patterns to commit messages.

Features:

- Generated Git Hook
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

Git Graft currently only has one command for generating the Git Hook and configuration file.

**run:**
`npx git-graft init`

The prompts will be used to construct the configuration file and ask to modify permissions to allow for execution of the generated Git Hook. Without permission to execute the Git Hook cannot work.

# Configuration

Configuration relies on RegEx inputs to determine the patterns to validate the branch and resulting prepended commit message with branch
information.

**branchTypes:** Refers to GitFlows from DevOps best practices i.e. `feature/*`, `test/*`, `bugfix/*`

**branchPattern:** Refers to the code/ticket and name of the branch following the branchType i.e. `*/ZZ-1-anything`

**regExFlag:** RegEx flag to pass into checks, default `gim`

RegEx Example:

https://regex101.com/r/TDEH27/1
