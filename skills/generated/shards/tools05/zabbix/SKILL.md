---
name: zabbix
description: "Run and troubleshoot the zabbix command-line tool on local machines. Use when requests mention \"zabbix\" or require workflows supported by this tool."
---

# zabbix

Use this skill to execute **zabbix** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2406 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.zabbix.com/
- **License:** AGPL-3.0-only
- **Catalog description:** Availability and monitoring solution
## Procedure
1. Confirm the tool is available.
   - `command -v zabbix`
   - `zabbix --version` (fallback: `zabbix -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search zabbix` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search zabbix` then install the matching package.
   - Fedora/RHEL: `dnf search zabbix` then install the matching package.
3. Inspect supported commands/options.
   - `zabbix --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
