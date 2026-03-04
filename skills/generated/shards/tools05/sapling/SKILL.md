---
name: sapling
description: "Run and troubleshoot the sapling command-line tool on local machines. Use when requests mention \"sapling\" or require workflows supported by this tool."
---

# sapling

Use this skill to execute **sapling** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2467 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://sapling-scm.com
- **License:** GPL-2.0-or-later
- **Catalog description:** Source control client
## Procedure
1. Confirm the tool is available.
   - `command -v sapling`
   - `sapling --version` (fallback: `sapling -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search sapling` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search sapling` then install the matching package.
   - Fedora/RHEL: `dnf search sapling` then install the matching package.
3. Inspect supported commands/options.
   - `sapling --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
