---
name: hiredis
description: "Run and troubleshoot the hiredis command-line tool on local machines. Use when requests mention \"hiredis\" or require workflows supported by this tool."
---

# hiredis

Use this skill to execute **hiredis** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2212 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/redis/hiredis
- **License:** BSD-3-Clause
- **Catalog description:** Minimalistic client for Redis
## Procedure
1. Confirm the tool is available.
   - `command -v hiredis`
   - `hiredis --version` (fallback: `hiredis -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search hiredis` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search hiredis` then install the matching package.
   - Fedora/RHEL: `dnf search hiredis` then install the matching package.
3. Inspect supported commands/options.
   - `hiredis --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
