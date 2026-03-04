---
name: regclient
description: "Run and troubleshoot the regclient command-line tool on local machines. Use when requests mention \"regclient\" or require workflows supported by this tool."
---

# regclient

Use this skill to execute **regclient** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2137 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://regclient.org/
- **License:** Apache-2.0
- **Catalog description:** Docker and OCI Registry Client in Go and tooling using those libraries
## Procedure
1. Confirm the tool is available.
   - `command -v regclient`
   - `regclient --version` (fallback: `regclient -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search regclient` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search regclient` then install the matching package.
   - Fedora/RHEL: `dnf search regclient` then install the matching package.
3. Inspect supported commands/options.
   - `regclient --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
