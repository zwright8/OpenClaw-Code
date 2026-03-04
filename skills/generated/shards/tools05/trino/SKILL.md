---
name: trino
description: "Run and troubleshoot the trino command-line tool on local machines. Use when requests mention \"trino\" or require workflows supported by this tool."
---

# trino

Use this skill to execute **trino** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2390 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://trino.io
- **License:** Apache-2.0
- **Catalog description:** Distributed SQL query engine for big data
## Procedure
1. Confirm the tool is available.
   - `command -v trino`
   - `trino --version` (fallback: `trino -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search trino` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search trino` then install the matching package.
   - Fedora/RHEL: `dnf search trino` then install the matching package.
3. Inspect supported commands/options.
   - `trino --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
