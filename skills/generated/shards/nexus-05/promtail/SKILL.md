---
name: promtail
description: "Run and troubleshoot the promtail command-line tool on local machines. Use when requests mention \"promtail\" or require workflows supported by this tool."
---

# promtail

Use this skill to execute **promtail** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2094 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://grafana.com/loki
- **License:** AGPL-3.0-only
- **Catalog description:** Log agent for Loki
## Procedure
1. Confirm the tool is available.
   - `command -v promtail`
   - `promtail --version` (fallback: `promtail -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search promtail` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search promtail` then install the matching package.
   - Fedora/RHEL: `dnf search promtail` then install the matching package.
3. Inspect supported commands/options.
   - `promtail --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
