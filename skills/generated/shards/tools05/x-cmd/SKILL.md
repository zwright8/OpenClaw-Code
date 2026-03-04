---
name: x-cmd
description: "Run and troubleshoot the x-cmd command-line tool on local machines. Use when requests mention \"x-cmd\" or require workflows supported by this tool."
---

# x-cmd

Use this skill to execute **x-cmd** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2077 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://x-cmd.com
- **License:** Apache-2.0 AND MIT AND BSD-3-Clause
- **Catalog description:** Bootstrap 1000+ command-line tools in seconds
## Procedure
1. Confirm the tool is available.
   - `command -v x-cmd`
   - `x-cmd --version` (fallback: `x-cmd -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search x-cmd` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search x-cmd` then install the matching package.
   - Fedora/RHEL: `dnf search x-cmd` then install the matching package.
3. Inspect supported commands/options.
   - `x-cmd --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
