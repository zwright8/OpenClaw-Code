---
name: osm2pgsql
description: "Run and troubleshoot the osm2pgsql command-line tool on local machines. Use when requests mention \"osm2pgsql\" or require workflows supported by this tool."
---

# osm2pgsql

Use this skill to execute **osm2pgsql** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2405 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://osm2pgsql.org
- **License:** GPL-2.0-only
- **Catalog description:** OpenStreetMap data to PostgreSQL converter
## Procedure
1. Confirm the tool is available.
   - `command -v osm2pgsql`
   - `osm2pgsql --version` (fallback: `osm2pgsql -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search osm2pgsql` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search osm2pgsql` then install the matching package.
   - Fedora/RHEL: `dnf search osm2pgsql` then install the matching package.
3. Inspect supported commands/options.
   - `osm2pgsql --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
