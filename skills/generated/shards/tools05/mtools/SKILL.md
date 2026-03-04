---
name: mtools
description: "Run and troubleshoot the mtools command-line tool on local machines. Use when requests mention \"mtools\" or require workflows supported by this tool."
---

# mtools

Use this skill to execute **mtools** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2013 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.gnu.org/software/mtools/
- **License:** GPL-3.0-or-later
- **Catalog description:** Tools for manipulating MSDOS files
## Procedure
1. Confirm the tool is available.
   - `command -v mtools`
   - `mtools --version` (fallback: `mtools -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mtools` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mtools` then install the matching package.
   - Fedora/RHEL: `dnf search mtools` then install the matching package.
3. Inspect supported commands/options.
   - `mtools --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
