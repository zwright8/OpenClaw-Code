---
name: vice
description: "Run and troubleshoot the vice command-line tool on local machines. Use when requests mention \"vice\" or require workflows supported by this tool."
---

# vice

Use this skill to execute **vice** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2252 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://sourceforge.net/projects/vice-emu/
- **License:** GPL-2.0-or-later
- **Catalog description:** Versatile Commodore Emulator
## Procedure
1. Confirm the tool is available.
   - `command -v vice`
   - `vice --version` (fallback: `vice -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search vice` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search vice` then install the matching package.
   - Fedora/RHEL: `dnf search vice` then install the matching package.
3. Inspect supported commands/options.
   - `vice --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
