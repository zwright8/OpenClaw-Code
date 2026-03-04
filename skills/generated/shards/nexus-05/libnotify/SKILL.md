---
name: libnotify
description: "Run and troubleshoot the libnotify command-line tool on local machines. Use when requests mention \"libnotify\" or require workflows supported by this tool."
---

# libnotify

Use this skill to execute **libnotify** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2159 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gitlab.gnome.org/GNOME/libnotify
- **License:** LGPL-2.1-or-later
- **Catalog description:** Library that sends desktop notifications to a notification daemon
## Procedure
1. Confirm the tool is available.
   - `command -v libnotify`
   - `libnotify --version` (fallback: `libnotify -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libnotify` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libnotify` then install the matching package.
   - Fedora/RHEL: `dnf search libnotify` then install the matching package.
3. Inspect supported commands/options.
   - `libnotify --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
