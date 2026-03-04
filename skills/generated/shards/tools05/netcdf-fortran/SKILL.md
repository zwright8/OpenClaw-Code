---
name: netcdf-fortran
description: "Run and troubleshoot the netcdf-fortran command-line tool on local machines. Use when requests mention \"netcdf-fortran\" or require workflows supported by this tool."
---

# netcdf-fortran

Use this skill to execute **netcdf-fortran** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2071 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.unidata.ucar.edu/software/netcdf/
- **License:** NetCDF
- **Catalog description:** Fortran libraries and utilities for NetCDF
## Procedure
1. Confirm the tool is available.
   - `command -v netcdf-fortran`
   - `netcdf-fortran --version` (fallback: `netcdf-fortran -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search netcdf-fortran` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search netcdf-fortran` then install the matching package.
   - Fedora/RHEL: `dnf search netcdf-fortran` then install the matching package.
3. Inspect supported commands/options.
   - `netcdf-fortran --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
