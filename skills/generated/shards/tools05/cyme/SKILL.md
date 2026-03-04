---
name: cyme
description: "Run and troubleshoot the cyme command-line tool on local machines. Use when requests mention \"cyme\" or require workflows supported by this tool."
---

# cyme

Use this skill to execute **cyme** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2103 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/tuna-f1sh/cyme
- **License:** GPL-3.0-or-later
- **Catalog description:** List system USB buses and devices
## Procedure
1. Confirm the tool is available.
   - `command -v cyme`
   - `cyme --version` (fallback: `cyme -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search cyme` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search cyme` then install the matching package.
   - Fedora/RHEL: `dnf search cyme` then install the matching package.
3. Inspect supported commands/options.
   - `cyme --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
