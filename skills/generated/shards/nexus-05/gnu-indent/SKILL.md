---
name: gnu-indent
description: "Run and troubleshoot the gnu-indent command-line tool on local machines. Use when requests mention \"gnu-indent\" or require workflows supported by this tool."
---

# gnu-indent

Use this skill to execute **gnu-indent** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2220 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.gnu.org/software/indent/
- **License:** GPL-3.0-or-later
- **Catalog description:** C code prettifier
## Procedure
1. Confirm the tool is available.
   - `command -v gnu-indent`
   - `gnu-indent --version` (fallback: `gnu-indent -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gnu-indent` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gnu-indent` then install the matching package.
   - Fedora/RHEL: `dnf search gnu-indent` then install the matching package.
3. Inspect supported commands/options.
   - `gnu-indent --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
