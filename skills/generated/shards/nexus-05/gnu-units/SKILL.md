---
name: gnu-units
description: "Run and troubleshoot the gnu-units command-line tool on local machines. Use when requests mention \"gnu-units\" or require workflows supported by this tool."
---

# gnu-units

Use this skill to execute **gnu-units** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2422 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.gnu.org/software/units/
- **License:** GPL-3.0-or-later
- **Catalog description:** GNU unit conversion tool
## Procedure
1. Confirm the tool is available.
   - `command -v gnu-units`
   - `gnu-units --version` (fallback: `gnu-units -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gnu-units` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gnu-units` then install the matching package.
   - Fedora/RHEL: `dnf search gnu-units` then install the matching package.
3. Inspect supported commands/options.
   - `gnu-units --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
