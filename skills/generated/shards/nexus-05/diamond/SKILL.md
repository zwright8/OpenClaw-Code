---
name: diamond
description: "Run and troubleshoot the diamond command-line tool on local machines. Use when requests mention \"diamond\" or require workflows supported by this tool."
---

# diamond

Use this skill to execute **diamond** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2344 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/bbuchfink/diamond
- **License:** GPL-3.0-or-later
- **Catalog description:** Accelerated BLAST compatible local sequence aligner
## Procedure
1. Confirm the tool is available.
   - `command -v diamond`
   - `diamond --version` (fallback: `diamond -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search diamond` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search diamond` then install the matching package.
   - Fedora/RHEL: `dnf search diamond` then install the matching package.
3. Inspect supported commands/options.
   - `diamond --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
