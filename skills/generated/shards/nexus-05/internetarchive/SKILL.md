---
name: internetarchive
description: "Run and troubleshoot the internetarchive command-line tool on local machines. Use when requests mention \"internetarchive\" or require workflows supported by this tool."
---

# internetarchive

Use this skill to execute **internetarchive** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2122 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/jjjake/internetarchive
- **License:** AGPL-3.0-or-later
- **Catalog description:** Python wrapper for the various Internet Archive APIs
## Procedure
1. Confirm the tool is available.
   - `command -v internetarchive`
   - `internetarchive --version` (fallback: `internetarchive -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search internetarchive` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search internetarchive` then install the matching package.
   - Fedora/RHEL: `dnf search internetarchive` then install the matching package.
3. Inspect supported commands/options.
   - `internetarchive --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
