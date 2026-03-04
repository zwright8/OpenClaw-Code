---
name: percona-server
description: "Run and troubleshoot the percona-server command-line tool on local machines. Use when requests mention \"percona-server\" or require workflows supported by this tool."
---

# percona-server

Use this skill to execute **percona-server** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2254 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.percona.com
- **License:** BSD-3-Clause
- **Catalog description:** Drop-in MySQL replacement
## Procedure
1. Confirm the tool is available.
   - `command -v percona-server`
   - `percona-server --version` (fallback: `percona-server -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search percona-server` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search percona-server` then install the matching package.
   - Fedora/RHEL: `dnf search percona-server` then install the matching package.
3. Inspect supported commands/options.
   - `percona-server --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
