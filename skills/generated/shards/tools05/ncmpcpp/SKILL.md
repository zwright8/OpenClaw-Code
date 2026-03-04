---
name: ncmpcpp
description: "Run and troubleshoot the ncmpcpp command-line tool on local machines. Use when requests mention \"ncmpcpp\" or require workflows supported by this tool."
---

# ncmpcpp

Use this skill to execute **ncmpcpp** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2059 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://rybczak.net/ncmpcpp/
- **License:** GPL-2.0-or-later
- **Catalog description:** Ncurses-based client for the Music Player Daemon
## Procedure
1. Confirm the tool is available.
   - `command -v ncmpcpp`
   - `ncmpcpp --version` (fallback: `ncmpcpp -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ncmpcpp` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ncmpcpp` then install the matching package.
   - Fedora/RHEL: `dnf search ncmpcpp` then install the matching package.
3. Inspect supported commands/options.
   - `ncmpcpp --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
