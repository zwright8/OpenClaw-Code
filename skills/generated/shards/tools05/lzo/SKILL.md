---
name: lzo
description: "Run and troubleshoot the lzo command-line tool on local machines. Use when requests mention \"lzo\" or require workflows supported by this tool."
---

# lzo

Use this skill to execute **lzo** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2244 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.oberhumer.com/opensource/lzo/
- **License:** GPL-2.0-or-later
- **Catalog description:** Real-time data compression library
## Procedure
1. Confirm the tool is available.
   - `command -v lzo`
   - `lzo --version` (fallback: `lzo -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search lzo` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search lzo` then install the matching package.
   - Fedora/RHEL: `dnf search lzo` then install the matching package.
3. Inspect supported commands/options.
   - `lzo --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
