---
name: ntp
description: "Run and troubleshoot the ntp command-line tool on local machines. Use when requests mention \"ntp\" or require workflows supported by this tool."
---

# ntp

Use this skill to execute **ntp** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2443 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.ntp.org
- **License:** BSD-2-Clause AND NTP
- **Catalog description:** Network Time Protocol (NTP) Distribution
## Procedure
1. Confirm the tool is available.
   - `command -v ntp`
   - `ntp --version` (fallback: `ntp -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ntp` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ntp` then install the matching package.
   - Fedora/RHEL: `dnf search ntp` then install the matching package.
3. Inspect supported commands/options.
   - `ntp --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
