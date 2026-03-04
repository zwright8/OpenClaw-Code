---
name: stlink
description: "Run and troubleshoot the stlink command-line tool on local machines. Use when requests mention \"stlink\" or require workflows supported by this tool."
---

# stlink

Use this skill to execute **stlink** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2014 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/stlink-org/stlink
- **License:** BSD-3-Clause
- **Catalog description:** STM32 discovery line Linux programmer
## Procedure
1. Confirm the tool is available.
   - `command -v stlink`
   - `stlink --version` (fallback: `stlink -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search stlink` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search stlink` then install the matching package.
   - Fedora/RHEL: `dnf search stlink` then install the matching package.
3. Inspect supported commands/options.
   - `stlink --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
