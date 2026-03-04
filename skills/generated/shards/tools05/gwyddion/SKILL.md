---
name: gwyddion
description: "Run and troubleshoot the gwyddion command-line tool on local machines. Use when requests mention \"gwyddion\" or require workflows supported by this tool."
---

# gwyddion

Use this skill to execute **gwyddion** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2282 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gwyddion.net/
- **License:** GPL-2.0-or-later
- **Catalog description:** Scanning Probe Microscopy visualization and analysis tool
## Procedure
1. Confirm the tool is available.
   - `command -v gwyddion`
   - `gwyddion --version` (fallback: `gwyddion -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gwyddion` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gwyddion` then install the matching package.
   - Fedora/RHEL: `dnf search gwyddion` then install the matching package.
3. Inspect supported commands/options.
   - `gwyddion --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
