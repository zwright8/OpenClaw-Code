---
name: qalculate-gtk
description: "Run and troubleshoot the qalculate-gtk command-line tool on local machines. Use when requests mention \"qalculate-gtk\" or require workflows supported by this tool."
---

# qalculate-gtk

Use this skill to execute **qalculate-gtk** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2227 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://qalculate.github.io/
- **License:** GPL-2.0-or-later
- **Catalog description:** Multi-purpose desktop calculator
## Procedure
1. Confirm the tool is available.
   - `command -v qalculate-gtk`
   - `qalculate-gtk --version` (fallback: `qalculate-gtk -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search qalculate-gtk` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search qalculate-gtk` then install the matching package.
   - Fedora/RHEL: `dnf search qalculate-gtk` then install the matching package.
3. Inspect supported commands/options.
   - `qalculate-gtk --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
