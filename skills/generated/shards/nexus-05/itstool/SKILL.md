---
name: itstool
description: "Run and troubleshoot the itstool command-line tool on local machines. Use when requests mention \"itstool\" or require workflows supported by this tool."
---

# itstool

Use this skill to execute **itstool** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2382 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://itstool.org/
- **License:** GPL-3.0-or-later
- **Catalog description:** Make XML documents translatable through PO files
## Procedure
1. Confirm the tool is available.
   - `command -v itstool`
   - `itstool --version` (fallback: `itstool -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search itstool` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search itstool` then install the matching package.
   - Fedora/RHEL: `dnf search itstool` then install the matching package.
3. Inspect supported commands/options.
   - `itstool --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
