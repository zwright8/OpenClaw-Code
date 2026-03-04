---
name: cdo
description: "Run and troubleshoot the cdo command-line tool on local machines. Use when requests mention \"cdo\" or require workflows supported by this tool."
---

# cdo

Use this skill to execute **cdo** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2370 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://code.mpimet.mpg.de/projects/cdo
- **License:** GPL-2.0-only
- **Catalog description:** Climate Data Operators
## Procedure
1. Confirm the tool is available.
   - `command -v cdo`
   - `cdo --version` (fallback: `cdo -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search cdo` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search cdo` then install the matching package.
   - Fedora/RHEL: `dnf search cdo` then install the matching package.
3. Inspect supported commands/options.
   - `cdo --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
