---
name: graph-tool
description: "Run and troubleshoot the graph-tool command-line tool on local machines. Use when requests mention \"graph-tool\" or require workflows supported by this tool."
---

# graph-tool

Use this skill to execute **graph-tool** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2051 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://graph-tool.skewed.de/
- **License:** LGPL-3.0-or-later
- **Catalog description:** Efficient network analysis for Python 3
## Procedure
1. Confirm the tool is available.
   - `command -v graph-tool`
   - `graph-tool --version` (fallback: `graph-tool -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search graph-tool` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search graph-tool` then install the matching package.
   - Fedora/RHEL: `dnf search graph-tool` then install the matching package.
3. Inspect supported commands/options.
   - `graph-tool --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
