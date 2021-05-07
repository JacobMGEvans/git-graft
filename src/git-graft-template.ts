// #!/bin/bash
// # Turn into a initilized stateful CLI tool
// # 1. Get Branch names
// # 2. Add Branch name into commits
// # 3. Make it configuration based --> use CLI tooling/libraries
// # 4. Prompt User for init configs
// # 5. In Configs have patterns/regex for improving the Branch Name => Commit Message i.e. feature/JIRA-number:description (user may only want JIRA-number)

// # This way you can customize which branches should be skipped when
// # prepending commit message.
// if [ -z "$BRANCHES_TO_SKIP" ]; then
// # Dynamically get branches to exclude from the prepending from config
//   BRANCHES_TO_SKIP=(main staging)
// fi

// # Grabs the branch name
// BRANCH_NAME=$(git symbolic-ref --short HEAD)
// BRANCH_NAME="${BRANCH_NAME##*/}"

// BRANCH_EXCLUDED=$(printf "%s\n" "${BRANCHES_TO_SKIP[@]}" | grep -c "^$BRANCH_NAME$")
// BRANCH_IN_COMMIT=$(grep -c "\[$BRANCH_NAME\]" $1)

// if [ -n "$BRANCH_NAME" ] && ! [[ $BRANCH_EXCLUDED -eq 1 ]] && ! [[ $BRANCH_IN_COMMIT -ge 1 ]]; then
//   sed -i.bak -e "1s/^/[$BRANCH_NAME] /" $1
// fi
