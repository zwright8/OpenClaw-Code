---
name: libqalculate
description: "Run and troubleshoot the libqalculate command-line tool on local machines. Use when requests mention \"libqalculate\" or require workflows supported by this tool."
---

# libqalculate

Use this skill to execute **libqalculate** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2022 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://qalculate.github.io/
- **License:** GPL-2.0-or-later
- **Catalog description:** Library for Qalculate! program
## Procedure
1. Confirm the tool is available.
   - `command -v libqalculate`
   - `libqalculate --version` (fallback: `libqalculate -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libqalculate` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libqalculate` then install the matching package.
   - Fedora/RHEL: `dnf search libqalculate` then install the matching package.
3. Inspect supported commands/options.
   - `libqalculate --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
