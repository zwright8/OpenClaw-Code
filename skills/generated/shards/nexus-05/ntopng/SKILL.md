---
name: ntopng
description: "Run and troubleshoot the ntopng command-line tool on local machines. Use when requests mention \"ntopng\" or require workflows supported by this tool."
---

# ntopng

Use this skill to execute **ntopng** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2246 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.ntop.org/products/traffic-analysis/ntop/
- **License:** GPL-3.0-only
- **Catalog description:** Next generation version of the original ntop
## Procedure
1. Confirm the tool is available.
   - `command -v ntopng`
   - `ntopng --version` (fallback: `ntopng -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ntopng` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ntopng` then install the matching package.
   - Fedora/RHEL: `dnf search ntopng` then install the matching package.
3. Inspect supported commands/options.
   - `ntopng --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
