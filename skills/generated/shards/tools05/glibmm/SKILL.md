---
name: glibmm
description: "Run and troubleshoot the glibmm command-line tool on local machines. Use when requests mention \"glibmm\" or require workflows supported by this tool."
---

# glibmm

Use this skill to execute **glibmm** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2043 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gtkmm.gnome.org/
- **License:** LGPL-2.1-or-later
- **Catalog description:** C++ interface to glib
## Procedure
1. Confirm the tool is available.
   - `command -v glibmm`
   - `glibmm --version` (fallback: `glibmm -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search glibmm` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search glibmm` then install the matching package.
   - Fedora/RHEL: `dnf search glibmm` then install the matching package.
3. Inspect supported commands/options.
   - `glibmm --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
