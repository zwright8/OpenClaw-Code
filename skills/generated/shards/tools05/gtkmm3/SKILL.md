---
name: gtkmm3
description: "Run and troubleshoot the gtkmm3 command-line tool on local machines. Use when requests mention \"gtkmm3\" or require workflows supported by this tool."
---

# gtkmm3

Use this skill to execute **gtkmm3** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2210 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.gtkmm.org/
- **License:** LGPL-2.1-or-later
- **Catalog description:** C++ interfaces for GTK+ and GNOME
## Procedure
1. Confirm the tool is available.
   - `command -v gtkmm3`
   - `gtkmm3 --version` (fallback: `gtkmm3 -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gtkmm3` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gtkmm3` then install the matching package.
   - Fedora/RHEL: `dnf search gtkmm3` then install the matching package.
3. Inspect supported commands/options.
   - `gtkmm3 --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
