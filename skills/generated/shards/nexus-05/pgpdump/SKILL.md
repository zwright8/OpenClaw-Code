---
name: pgpdump
description: "Run and troubleshoot the pgpdump command-line tool on local machines. Use when requests mention \"pgpdump\" or require workflows supported by this tool."
---

# pgpdump

Use this skill to execute **pgpdump** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2400 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.mew.org/~kazu/proj/pgpdump/en/
- **License:** BSD-3-Clause
- **Catalog description:** PGP packet visualizer
## Procedure
1. Confirm the tool is available.
   - `command -v pgpdump`
   - `pgpdump --version` (fallback: `pgpdump -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search pgpdump` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search pgpdump` then install the matching package.
   - Fedora/RHEL: `dnf search pgpdump` then install the matching package.
3. Inspect supported commands/options.
   - `pgpdump --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
