---
name: mimirtool
description: "Run and troubleshoot the mimirtool command-line tool on local machines. Use when requests mention \"mimirtool\" or require workflows supported by this tool."
---

# mimirtool

Use this skill to execute **mimirtool** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2068 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://grafana.com/docs/mimir/latest/operators-guide/tools/mimirtool/
- **License:** AGPL-3.0-only
- **Catalog description:** CLI for interacting with Grafana Mimir
## Procedure
1. Confirm the tool is available.
   - `command -v mimirtool`
   - `mimirtool --version` (fallback: `mimirtool -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mimirtool` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mimirtool` then install the matching package.
   - Fedora/RHEL: `dnf search mimirtool` then install the matching package.
3. Inspect supported commands/options.
   - `mimirtool --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
