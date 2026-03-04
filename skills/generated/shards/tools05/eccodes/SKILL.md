---
name: eccodes
description: "Run and troubleshoot the eccodes command-line tool on local machines. Use when requests mention \"eccodes\" or require workflows supported by this tool."
---

# eccodes

Use this skill to execute **eccodes** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2154 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://confluence.ecmwf.int/display/ECC
- **License:** Apache-2.0
- **Catalog description:** Decode and encode messages in the GRIB 1/2 and BUFR 3/4 formats
## Procedure
1. Confirm the tool is available.
   - `command -v eccodes`
   - `eccodes --version` (fallback: `eccodes -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search eccodes` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search eccodes` then install the matching package.
   - Fedora/RHEL: `dnf search eccodes` then install the matching package.
3. Inspect supported commands/options.
   - `eccodes --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
