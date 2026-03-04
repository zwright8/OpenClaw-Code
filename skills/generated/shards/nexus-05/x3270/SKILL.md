---
name: x3270
description: "Run and troubleshoot the x3270 command-line tool on local machines. Use when requests mention \"x3270\" or require workflows supported by this tool."
---

# x3270

Use this skill to execute **x3270** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2477 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://x3270.bgp.nu/
- **License:** BSD-3-Clause
- **Catalog description:** IBM 3270 terminal emulator for the X Window System and Windows
## Procedure
1. Confirm the tool is available.
   - `command -v x3270`
   - `x3270 --version` (fallback: `x3270 -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search x3270` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search x3270` then install the matching package.
   - Fedora/RHEL: `dnf search x3270` then install the matching package.
3. Inspect supported commands/options.
   - `x3270 --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
