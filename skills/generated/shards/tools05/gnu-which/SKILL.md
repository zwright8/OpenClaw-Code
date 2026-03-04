---
name: gnu-which
description: "Run and troubleshoot the gnu-which command-line tool on local machines. Use when requests mention \"gnu-which\" or require workflows supported by this tool."
---

# gnu-which

Use this skill to execute **gnu-which** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2102 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://savannah.gnu.org/projects/which/
- **License:** GPL-3.0-or-later
- **Catalog description:** GNU implementation of which utility
## Procedure
1. Confirm the tool is available.
   - `command -v gnu-which`
   - `gnu-which --version` (fallback: `gnu-which -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gnu-which` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gnu-which` then install the matching package.
   - Fedora/RHEL: `dnf search gnu-which` then install the matching package.
3. Inspect supported commands/options.
   - `gnu-which --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
