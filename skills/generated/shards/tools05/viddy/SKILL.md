---
name: viddy
description: "Run and troubleshoot the viddy command-line tool on local machines. Use when requests mention \"viddy\" or require workflows supported by this tool."
---

# viddy

Use this skill to execute **viddy** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2349 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/sachaos/viddy
- **License:** MIT
- **Catalog description:** Modern watch command
## Procedure
1. Confirm the tool is available.
   - `command -v viddy`
   - `viddy --version` (fallback: `viddy -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search viddy` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search viddy` then install the matching package.
   - Fedora/RHEL: `dnf search viddy` then install the matching package.
3. Inspect supported commands/options.
   - `viddy --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
