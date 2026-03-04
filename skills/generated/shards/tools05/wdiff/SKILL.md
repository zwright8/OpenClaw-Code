---
name: wdiff
description: "Run and troubleshoot the wdiff command-line tool on local machines. Use when requests mention \"wdiff\" or require workflows supported by this tool."
---

# wdiff

Use this skill to execute **wdiff** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2461 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.gnu.org/software/wdiff/
- **License:** GPL-3.0-or-later
- **Catalog description:** Display word differences between text files
## Procedure
1. Confirm the tool is available.
   - `command -v wdiff`
   - `wdiff --version` (fallback: `wdiff -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search wdiff` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search wdiff` then install the matching package.
   - Fedora/RHEL: `dnf search wdiff` then install the matching package.
3. Inspect supported commands/options.
   - `wdiff --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
