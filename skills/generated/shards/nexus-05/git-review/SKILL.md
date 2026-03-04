---
name: git-review
description: "Run and troubleshoot the git-review command-line tool on local machines. Use when requests mention \"git-review\" or require workflows supported by this tool."
---

# git-review

Use this skill to execute **git-review** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2366 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://opendev.org/opendev/git-review
- **License:** Apache-2.0
- **Catalog description:** Submit git branches to gerrit for review
## Procedure
1. Confirm the tool is available.
   - `command -v git-review`
   - `git-review --version` (fallback: `git-review -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search git-review` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search git-review` then install the matching package.
   - Fedora/RHEL: `dnf search git-review` then install the matching package.
3. Inspect supported commands/options.
   - `git-review --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
