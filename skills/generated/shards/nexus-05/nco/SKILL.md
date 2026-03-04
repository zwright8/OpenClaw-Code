---
name: nco
description: "Run and troubleshoot the nco command-line tool on local machines. Use when requests mention \"nco\" or require workflows supported by this tool."
---

# nco

Use this skill to execute **nco** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2496 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://nco.sourceforge.net/
- **License:** BSD-3-Clause
- **Catalog description:** Command-line operators for netCDF and HDF files
## Procedure
1. Confirm the tool is available.
   - `command -v nco`
   - `nco --version` (fallback: `nco -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search nco` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search nco` then install the matching package.
   - Fedora/RHEL: `dnf search nco` then install the matching package.
3. Inspect supported commands/options.
   - `nco --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
