---
name: unpaper
description: "Run and troubleshoot the unpaper command-line tool on local machines. Use when requests mention \"unpaper\" or require workflows supported by this tool."
---

# unpaper

Use this skill to execute **unpaper** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2291 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.flameeyes.com/projects/unpaper
- **License:** GPL-2.0-or-later
- **Catalog description:** Post-processing for scanned/photocopied books
## Procedure
1. Confirm the tool is available.
   - `command -v unpaper`
   - `unpaper --version` (fallback: `unpaper -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search unpaper` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search unpaper` then install the matching package.
   - Fedora/RHEL: `dnf search unpaper` then install the matching package.
3. Inspect supported commands/options.
   - `unpaper --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
