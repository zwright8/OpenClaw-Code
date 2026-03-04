---
name: get-iplayer
description: "Run and troubleshoot the get_iplayer command-line tool on local machines. Use when requests mention \"get_iplayer\" or require workflows supported by this tool."
---

# get_iplayer

Use this skill to execute **get_iplayer** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2197 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/get-iplayer/get_iplayer
- **License:** GPL-3.0-or-later
- **Catalog description:** Utility for downloading TV and radio programmes from BBC iPlayer
## Procedure
1. Confirm the tool is available.
   - `command -v get_iplayer`
   - `get_iplayer --version` (fallback: `get_iplayer -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search get_iplayer` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search get_iplayer` then install the matching package.
   - Fedora/RHEL: `dnf search get_iplayer` then install the matching package.
3. Inspect supported commands/options.
   - `get_iplayer --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
