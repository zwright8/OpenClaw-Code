---
name: keploy
description: "Run and troubleshoot the keploy command-line tool on local machines. Use when requests mention \"keploy\" or require workflows supported by this tool."
---

# keploy

Use this skill to execute **keploy** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2469 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://keploy.io
- **License:** Apache-2.0
- **Catalog description:** Testing Toolkit creates test-cases and data mocks from API calls, DB queries
## Procedure
1. Confirm the tool is available.
   - `command -v keploy`
   - `keploy --version` (fallback: `keploy -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search keploy` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search keploy` then install the matching package.
   - Fedora/RHEL: `dnf search keploy` then install the matching package.
3. Inspect supported commands/options.
   - `keploy --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
