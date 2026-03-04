---
name: geoipupdate
description: "Run and troubleshoot the geoipupdate command-line tool on local machines. Use when requests mention \"geoipupdate\" or require workflows supported by this tool."
---

# geoipupdate

Use this skill to execute **geoipupdate** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2499 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/maxmind/geoipupdate
- **License:** Apache-2.0
- **Catalog description:** Automatic updates of GeoIP2 and GeoIP Legacy databases
## Procedure
1. Confirm the tool is available.
   - `command -v geoipupdate`
   - `geoipupdate --version` (fallback: `geoipupdate -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search geoipupdate` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search geoipupdate` then install the matching package.
   - Fedora/RHEL: `dnf search geoipupdate` then install the matching package.
3. Inspect supported commands/options.
   - `geoipupdate --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
