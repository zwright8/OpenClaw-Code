---
name: streamrip
description: "Run and troubleshoot the streamrip command-line tool on local machines. Use when requests mention \"streamrip\" or require workflows supported by this tool."
---

# streamrip

Use this skill to execute **streamrip** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2235 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/nathom/streamrip
- **License:** GPL-3.0-only
- **Catalog description:** Scriptable music downloader for Qobuz, Tidal, SoundCloud, and Deezer
## Procedure
1. Confirm the tool is available.
   - `command -v streamrip`
   - `streamrip --version` (fallback: `streamrip -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search streamrip` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search streamrip` then install the matching package.
   - Fedora/RHEL: `dnf search streamrip` then install the matching package.
3. Inspect supported commands/options.
   - `streamrip --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
