---
name: freeciv
description: "Run and troubleshoot the freeciv command-line tool on local machines. Use when requests mention \"freeciv\" or require workflows supported by this tool."
---

# freeciv

Use this skill to execute **freeciv** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2039 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://freeciv.org/
- **License:** GPL-2.0-or-later
- **Catalog description:** Free and Open Source empire-building strategy game
## Procedure
1. Confirm the tool is available.
   - `command -v freeciv`
   - `freeciv --version` (fallback: `freeciv -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search freeciv` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search freeciv` then install the matching package.
   - Fedora/RHEL: `dnf search freeciv` then install the matching package.
3. Inspect supported commands/options.
   - `freeciv --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
