---
name: gtksourceview4
description: "Run and troubleshoot the gtksourceview4 command-line tool on local machines. Use when requests mention \"gtksourceview4\" or require workflows supported by this tool."
---

# gtksourceview4

Use this skill to execute **gtksourceview4** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2341 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://projects.gnome.org/gtksourceview/
- **License:** LGPL-2.1-or-later
- **Catalog description:** Text view with syntax, undo/redo, and text marks
## Procedure
1. Confirm the tool is available.
   - `command -v gtksourceview4`
   - `gtksourceview4 --version` (fallback: `gtksourceview4 -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gtksourceview4` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gtksourceview4` then install the matching package.
   - Fedora/RHEL: `dnf search gtksourceview4` then install the matching package.
3. Inspect supported commands/options.
   - `gtksourceview4 --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
