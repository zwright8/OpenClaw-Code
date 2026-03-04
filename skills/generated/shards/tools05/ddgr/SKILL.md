---
name: ddgr
description: "Run and troubleshoot the ddgr command-line tool on local machines. Use when requests mention \"ddgr\" or require workflows supported by this tool."
---

# ddgr

Use this skill to execute **ddgr** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2431 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/jarun/ddgr
- **License:** GPL-3.0-or-later
- **Catalog description:** DuckDuckGo from the terminal
## Procedure
1. Confirm the tool is available.
   - `command -v ddgr`
   - `ddgr --version` (fallback: `ddgr -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ddgr` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ddgr` then install the matching package.
   - Fedora/RHEL: `dnf search ddgr` then install the matching package.
3. Inspect supported commands/options.
   - `ddgr --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
