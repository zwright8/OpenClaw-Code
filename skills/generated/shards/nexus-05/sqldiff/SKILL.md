---
name: sqldiff
description: "Run and troubleshoot the sqldiff command-line tool on local machines. Use when requests mention \"sqldiff\" or require workflows supported by this tool."
---

# sqldiff

Use this skill to execute **sqldiff** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2335 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.sqlite.org/sqldiff.html
- **License:** blessing
- **Catalog description:** Displays the differences between SQLite databases
## Procedure
1. Confirm the tool is available.
   - `command -v sqldiff`
   - `sqldiff --version` (fallback: `sqldiff -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search sqldiff` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search sqldiff` then install the matching package.
   - Fedora/RHEL: `dnf search sqldiff` then install the matching package.
3. Inspect supported commands/options.
   - `sqldiff --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
