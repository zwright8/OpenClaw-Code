---
name: lighttpd
description: "Run and troubleshoot the lighttpd command-line tool on local machines. Use when requests mention \"lighttpd\" or require workflows supported by this tool."
---

# lighttpd

Use this skill to execute **lighttpd** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2161 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.lighttpd.net/
- **License:** BSD-3-Clause
- **Catalog description:** Small memory footprint, flexible web-server
## Procedure
1. Confirm the tool is available.
   - `command -v lighttpd`
   - `lighttpd --version` (fallback: `lighttpd -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search lighttpd` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search lighttpd` then install the matching package.
   - Fedora/RHEL: `dnf search lighttpd` then install the matching package.
3. Inspect supported commands/options.
   - `lighttpd --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
