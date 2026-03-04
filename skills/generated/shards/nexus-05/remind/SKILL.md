---
name: remind
description: "Run and troubleshoot the remind command-line tool on local machines. Use when requests mention \"remind\" or require workflows supported by this tool."
---

# remind

Use this skill to execute **remind** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2409 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://dianne.skoll.ca/projects/remind/
- **License:** GPL-2.0-only
- **Catalog description:** Sophisticated calendar and alarm
## Procedure
1. Confirm the tool is available.
   - `command -v remind`
   - `remind --version` (fallback: `remind -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search remind` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search remind` then install the matching package.
   - Fedora/RHEL: `dnf search remind` then install the matching package.
3. Inspect supported commands/options.
   - `remind --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
