---
name: loki
description: "Run and troubleshoot the loki command-line tool on local machines. Use when requests mention \"loki\" or require workflows supported by this tool."
---

# loki

Use this skill to execute **loki** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2275 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://grafana.com/loki
- **License:** AGPL-3.0-only
- **Catalog description:** Horizontally-scalable, highly-available log aggregation system
## Procedure
1. Confirm the tool is available.
   - `command -v loki`
   - `loki --version` (fallback: `loki -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search loki` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search loki` then install the matching package.
   - Fedora/RHEL: `dnf search loki` then install the matching package.
3. Inspect supported commands/options.
   - `loki --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
