---
name: spotifyd
description: "Run and troubleshoot the spotifyd command-line tool on local machines. Use when requests mention \"spotifyd\" or require workflows supported by this tool."
---

# spotifyd

Use this skill to execute **spotifyd** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2181 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://spotifyd.rs/
- **License:** GPL-3.0-only
- **Catalog description:** Spotify daemon
## Procedure
1. Confirm the tool is available.
   - `command -v spotifyd`
   - `spotifyd --version` (fallback: `spotifyd -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search spotifyd` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search spotifyd` then install the matching package.
   - Fedora/RHEL: `dnf search spotifyd` then install the matching package.
3. Inspect supported commands/options.
   - `spotifyd --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
