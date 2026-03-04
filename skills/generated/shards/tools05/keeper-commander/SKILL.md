---
name: keeper-commander
description: "Run and troubleshoot the keeper-commander command-line tool on local machines. Use when requests mention \"keeper-commander\" or require workflows supported by this tool."
---

# keeper-commander

Use this skill to execute **keeper-commander** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2171 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://docs.keeper.io/en/privileged-access-manager/commander-cli/overview
- **License:** MIT
- **Catalog description:** Command-line and SDK interface to Keeper Password Manager
## Procedure
1. Confirm the tool is available.
   - `command -v keeper-commander`
   - `keeper-commander --version` (fallback: `keeper-commander -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search keeper-commander` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search keeper-commander` then install the matching package.
   - Fedora/RHEL: `dnf search keeper-commander` then install the matching package.
3. Inspect supported commands/options.
   - `keeper-commander --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
