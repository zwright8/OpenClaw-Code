---
name: gtk-vnc
description: "Run and troubleshoot the gtk-vnc command-line tool on local machines. Use when requests mention \"gtk-vnc\" or require workflows supported by this tool."
---

# gtk-vnc

Use this skill to execute **gtk-vnc** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2098 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gitlab.gnome.org/GNOME/gtk-vnc
- **License:** LGPL-2.1-or-later
- **Catalog description:** VNC viewer widget for GTK
## Procedure
1. Confirm the tool is available.
   - `command -v gtk-vnc`
   - `gtk-vnc --version` (fallback: `gtk-vnc -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gtk-vnc` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gtk-vnc` then install the matching package.
   - Fedora/RHEL: `dnf search gtk-vnc` then install the matching package.
3. Inspect supported commands/options.
   - `gtk-vnc --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
