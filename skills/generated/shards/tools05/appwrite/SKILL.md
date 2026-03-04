---
name: appwrite
description: "Run and troubleshoot the appwrite command-line tool on local machines. Use when requests mention \"appwrite\" or require workflows supported by this tool."
---

# appwrite

Use this skill to execute **appwrite** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2263 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://appwrite.io
- **License:** BSD-3-Clause
- **Catalog description:** Command-line tool for Appwrite
## Procedure
1. Confirm the tool is available.
   - `command -v appwrite`
   - `appwrite --version` (fallback: `appwrite -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search appwrite` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search appwrite` then install the matching package.
   - Fedora/RHEL: `dnf search appwrite` then install the matching package.
3. Inspect supported commands/options.
   - `appwrite --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
