---
name: fortio
description: "Run and troubleshoot the fortio command-line tool on local machines. Use when requests mention \"fortio\" or require workflows supported by this tool."
---

# fortio

Use this skill to execute **fortio** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2475 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://fortio.org/
- **License:** Apache-2.0
- **Catalog description:** HTTP and gRPC load testing and visualization tool and server
## Procedure
1. Confirm the tool is available.
   - `command -v fortio`
   - `fortio --version` (fallback: `fortio -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search fortio` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search fortio` then install the matching package.
   - Fedora/RHEL: `dnf search fortio` then install the matching package.
3. Inspect supported commands/options.
   - `fortio --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
