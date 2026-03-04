---
name: nexttrace
description: "Run and troubleshoot the nexttrace command-line tool on local machines. Use when requests mention \"nexttrace\" or require workflows supported by this tool."
---

# nexttrace

Use this skill to execute **nexttrace** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2065 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.nxtrace.org/
- **License:** GPL-3.0-only
- **Catalog description:** Open source visual route tracking CLI tool
## Procedure
1. Confirm the tool is available.
   - `command -v nexttrace`
   - `nexttrace --version` (fallback: `nexttrace -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search nexttrace` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search nexttrace` then install the matching package.
   - Fedora/RHEL: `dnf search nexttrace` then install the matching package.
3. Inspect supported commands/options.
   - `nexttrace --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
