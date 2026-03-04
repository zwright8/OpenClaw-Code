---
name: scummvm
description: "Run and troubleshoot the scummvm command-line tool on local machines. Use when requests mention \"scummvm\" or require workflows supported by this tool."
---

# scummvm

Use this skill to execute **scummvm** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2427 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.scummvm.org/
- **License:** GPL-3.0-or-later
- **Catalog description:** Graphic adventure game interpreter
## Procedure
1. Confirm the tool is available.
   - `command -v scummvm`
   - `scummvm --version` (fallback: `scummvm -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search scummvm` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search scummvm` then install the matching package.
   - Fedora/RHEL: `dnf search scummvm` then install the matching package.
3. Inspect supported commands/options.
   - `scummvm --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
