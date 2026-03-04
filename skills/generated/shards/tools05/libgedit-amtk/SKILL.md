---
name: libgedit-amtk
description: "Run and troubleshoot the libgedit-amtk command-line tool on local machines. Use when requests mention \"libgedit-amtk\" or require workflows supported by this tool."
---

# libgedit-amtk

Use this skill to execute **libgedit-amtk** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2178 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gedit-technology.net
- **License:** LGPL-3.0-or-later
- **Catalog description:** Actions, Menus and Toolbars Kit for GTK applications
## Procedure
1. Confirm the tool is available.
   - `command -v libgedit-amtk`
   - `libgedit-amtk --version` (fallback: `libgedit-amtk -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libgedit-amtk` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libgedit-amtk` then install the matching package.
   - Fedora/RHEL: `dnf search libgedit-amtk` then install the matching package.
3. Inspect supported commands/options.
   - `libgedit-amtk --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
