---
name: syslog-ng
description: "Run and troubleshoot the syslog-ng command-line tool on local machines. Use when requests mention \"syslog-ng\" or require workflows supported by this tool."
---

# syslog-ng

Use this skill to execute **syslog-ng** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2067 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.syslog-ng.com
- **License:** LGPL-2.1-or-later AND GPL-2.0-or-later
- **Catalog description:** Log daemon with advanced processing pipeline and a wide range of I/O methods
## Procedure
1. Confirm the tool is available.
   - `command -v syslog-ng`
   - `syslog-ng --version` (fallback: `syslog-ng -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search syslog-ng` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search syslog-ng` then install the matching package.
   - Fedora/RHEL: `dnf search syslog-ng` then install the matching package.
3. Inspect supported commands/options.
   - `syslog-ng --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
