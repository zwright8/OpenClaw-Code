---
name: dependabot
description: "Run and troubleshoot the dependabot command-line tool on local machines. Use when requests mention \"dependabot\" or require workflows supported by this tool."
---

# dependabot

Use this skill to execute **dependabot** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2147 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/dependabot/cli
- **License:** MIT
- **Catalog description:** Tool for testing and debugging Dependabot update jobs
## Procedure
1. Confirm the tool is available.
   - `command -v dependabot`
   - `dependabot --version` (fallback: `dependabot -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search dependabot` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search dependabot` then install the matching package.
   - Fedora/RHEL: `dnf search dependabot` then install the matching package.
3. Inspect supported commands/options.
   - `dependabot --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
