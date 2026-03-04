---
name: geeqie
description: "Run and troubleshoot the geeqie command-line tool on local machines. Use when requests mention \"geeqie\" or require workflows supported by this tool."
---

# geeqie

Use this skill to execute **geeqie** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2183 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.geeqie.org/
- **License:** GPL-2.0-or-later
- **Catalog description:** Lightweight Gtk+ based image viewer
## Procedure
1. Confirm the tool is available.
   - `command -v geeqie`
   - `geeqie --version` (fallback: `geeqie -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search geeqie` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search geeqie` then install the matching package.
   - Fedora/RHEL: `dnf search geeqie` then install the matching package.
3. Inspect supported commands/options.
   - `geeqie --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
