---
name: berkeley-db
description: "Run and troubleshoot the berkeley-db command-line tool on local machines. Use when requests mention \"berkeley-db\" or require workflows supported by this tool."
---

# berkeley-db

Use this skill to execute **berkeley-db** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2185 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.oracle.com/database/technologies/related/berkeleydb.html
- **License:** AGPL-3.0-only
- **Catalog description:** High performance key/value database
## Procedure
1. Confirm the tool is available.
   - `command -v berkeley-db`
   - `berkeley-db --version` (fallback: `berkeley-db -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search berkeley-db` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search berkeley-db` then install the matching package.
   - Fedora/RHEL: `dnf search berkeley-db` then install the matching package.
3. Inspect supported commands/options.
   - `berkeley-db --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
