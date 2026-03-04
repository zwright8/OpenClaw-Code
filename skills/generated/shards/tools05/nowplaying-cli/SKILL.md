---
name: nowplaying-cli
description: "Run and troubleshoot the nowplaying-cli command-line tool on local machines. Use when requests mention \"nowplaying-cli\" or require workflows supported by this tool."
---

# nowplaying-cli

Use this skill to execute **nowplaying-cli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2286 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/kirtan-shah/nowplaying-cli
- **License:** GPL-3.0-or-later
- **Catalog description:** Retrieves currently playing media, and simulates media actions
## Procedure
1. Confirm the tool is available.
   - `command -v nowplaying-cli`
   - `nowplaying-cli --version` (fallback: `nowplaying-cli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search nowplaying-cli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search nowplaying-cli` then install the matching package.
   - Fedora/RHEL: `dnf search nowplaying-cli` then install the matching package.
3. Inspect supported commands/options.
   - `nowplaying-cli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
