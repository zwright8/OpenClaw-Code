---
name: ntfy
description: "Run and troubleshoot the ntfy command-line tool on local machines. Use when requests mention \"ntfy\" or require workflows supported by this tool."
---

# ntfy

Use this skill to execute **ntfy** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2057 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://ntfy.sh/
- **License:** Apache-2.0 OR GPL-2.0-only
- **Catalog description:** Send push notifications to your phone or desktop via PUT/POST
## Procedure
1. Confirm the tool is available.
   - `command -v ntfy`
   - `ntfy --version` (fallback: `ntfy -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ntfy` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ntfy` then install the matching package.
   - Fedora/RHEL: `dnf search ntfy` then install the matching package.
3. Inspect supported commands/options.
   - `ntfy --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
