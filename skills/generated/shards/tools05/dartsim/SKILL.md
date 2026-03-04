---
name: dartsim
description: "Run and troubleshoot the dartsim command-line tool on local machines. Use when requests mention \"dartsim\" or require workflows supported by this tool."
---

# dartsim

Use this skill to execute **dartsim** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2339 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://dartsim.github.io/
- **License:** BSD-2-Clause
- **Catalog description:** Dynamic Animation and Robotics Toolkit
## Procedure
1. Confirm the tool is available.
   - `command -v dartsim`
   - `dartsim --version` (fallback: `dartsim -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search dartsim` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search dartsim` then install the matching package.
   - Fedora/RHEL: `dnf search dartsim` then install the matching package.
3. Inspect supported commands/options.
   - `dartsim --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
