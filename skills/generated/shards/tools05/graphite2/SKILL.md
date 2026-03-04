---
name: graphite2
description: "Run and troubleshoot the graphite2 command-line tool on local machines. Use when requests mention \"graphite2\" or require workflows supported by this tool."
---

# graphite2

Use this skill to execute **graphite2** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2361 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://graphite.sil.org/
- **License:** GPL-2.0-or-later OR LGPL-2.1-or-later OR MPL-1.1+
- **Catalog description:** Smart font renderer for non-Roman scripts
## Procedure
1. Confirm the tool is available.
   - `command -v graphite2`
   - `graphite2 --version` (fallback: `graphite2 -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search graphite2` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search graphite2` then install the matching package.
   - Fedora/RHEL: `dnf search graphite2` then install the matching package.
3. Inspect supported commands/options.
   - `graphite2 --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
