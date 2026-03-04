---
name: libgedit-gtksourceview
description: "Run and troubleshoot the libgedit-gtksourceview command-line tool on local machines. Use when requests mention \"libgedit-gtksourceview\" or require workflows supported by this tool."
---

# libgedit-gtksourceview

Use this skill to execute **libgedit-gtksourceview** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2209 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gitlab.gnome.org/World/gedit/libgedit-gtksourceview
- **License:** LGPL-2.1-only
- **Catalog description:** Text editor widget for code editing
## Procedure
1. Confirm the tool is available.
   - `command -v libgedit-gtksourceview`
   - `libgedit-gtksourceview --version` (fallback: `libgedit-gtksourceview -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libgedit-gtksourceview` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libgedit-gtksourceview` then install the matching package.
   - Fedora/RHEL: `dnf search libgedit-gtksourceview` then install the matching package.
3. Inspect supported commands/options.
   - `libgedit-gtksourceview --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
