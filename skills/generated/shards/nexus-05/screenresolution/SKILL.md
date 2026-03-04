---
name: screenresolution
description: "Run and troubleshoot the screenresolution command-line tool on local machines. Use when requests mention \"screenresolution\" or require workflows supported by this tool."
---

# screenresolution

Use this skill to execute **screenresolution** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2216 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/jhford/screenresolution
- **License:** GPL-2.0-only
- **Catalog description:** Get, set, and list display resolution
## Procedure
1. Confirm the tool is available.
   - `command -v screenresolution`
   - `screenresolution --version` (fallback: `screenresolution -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search screenresolution` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search screenresolution` then install the matching package.
   - Fedora/RHEL: `dnf search screenresolution` then install the matching package.
3. Inspect supported commands/options.
   - `screenresolution --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
