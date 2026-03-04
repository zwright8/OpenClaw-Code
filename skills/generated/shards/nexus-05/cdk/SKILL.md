---
name: cdk
description: "Run and troubleshoot the cdk command-line tool on local machines. Use when requests mention \"cdk\" or require workflows supported by this tool."
---

# cdk

Use this skill to execute **cdk** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2419 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://invisible-island.net/cdk/
- **License:** BSD-4-Clause-UC
- **Catalog description:** Curses development kit provides predefined curses widget for apps
## Procedure
1. Confirm the tool is available.
   - `command -v cdk`
   - `cdk --version` (fallback: `cdk -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search cdk` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search cdk` then install the matching package.
   - Fedora/RHEL: `dnf search cdk` then install the matching package.
3. Inspect supported commands/options.
   - `cdk --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
