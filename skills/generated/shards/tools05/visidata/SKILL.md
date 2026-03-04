---
name: visidata
description: "Run and troubleshoot the visidata command-line tool on local machines. Use when requests mention \"visidata\" or require workflows supported by this tool."
---

# visidata

Use this skill to execute **visidata** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2155 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.visidata.org/
- **License:** GPL-3.0-or-later
- **Catalog description:** Terminal spreadsheet multitool for discovering and arranging data
## Procedure
1. Confirm the tool is available.
   - `command -v visidata`
   - `visidata --version` (fallback: `visidata -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search visidata` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search visidata` then install the matching package.
   - Fedora/RHEL: `dnf search visidata` then install the matching package.
3. Inspect supported commands/options.
   - `visidata --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
