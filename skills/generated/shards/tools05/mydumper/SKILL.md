---
name: mydumper
description: "Run and troubleshoot the mydumper command-line tool on local machines. Use when requests mention \"mydumper\" or require workflows supported by this tool."
---

# mydumper

Use this skill to execute **mydumper** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2030 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/mydumper/mydumper
- **License:** GPL-3.0-or-later
- **Catalog description:** MySQL logical backup tool
## Procedure
1. Confirm the tool is available.
   - `command -v mydumper`
   - `mydumper --version` (fallback: `mydumper -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mydumper` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mydumper` then install the matching package.
   - Fedora/RHEL: `dnf search mydumper` then install the matching package.
3. Inspect supported commands/options.
   - `mydumper --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
