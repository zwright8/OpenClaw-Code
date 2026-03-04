---
name: bzt
description: "Run and troubleshoot the bzt command-line tool on local machines. Use when requests mention \"bzt\" or require workflows supported by this tool."
---

# bzt

Use this skill to execute **bzt** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2150 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gettaurus.org/
- **License:** Apache-2.0
- **Catalog description:** BlazeMeter Taurus
## Procedure
1. Confirm the tool is available.
   - `command -v bzt`
   - `bzt --version` (fallback: `bzt -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search bzt` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search bzt` then install the matching package.
   - Fedora/RHEL: `dnf search bzt` then install the matching package.
3. Inspect supported commands/options.
   - `bzt --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
