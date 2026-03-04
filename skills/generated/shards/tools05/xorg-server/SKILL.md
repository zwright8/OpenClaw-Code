---
name: xorg-server
description: "Run and troubleshoot the xorg-server command-line tool on local machines. Use when requests mention \"xorg-server\" or require workflows supported by this tool."
---

# xorg-server

Use this skill to execute **xorg-server** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2272 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.x.org
- **License:** MIT AND APSL-2.0
- **Catalog description:** X Window System display server
## Procedure
1. Confirm the tool is available.
   - `command -v xorg-server`
   - `xorg-server --version` (fallback: `xorg-server -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search xorg-server` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search xorg-server` then install the matching package.
   - Fedora/RHEL: `dnf search xorg-server` then install the matching package.
3. Inspect supported commands/options.
   - `xorg-server --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
