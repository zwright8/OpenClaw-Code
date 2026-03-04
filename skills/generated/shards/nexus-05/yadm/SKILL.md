---
name: yadm
description: "Run and troubleshoot the yadm command-line tool on local machines. Use when requests mention \"yadm\" or require workflows supported by this tool."
---

# yadm

Use this skill to execute **yadm** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2008 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://yadm.io/
- **License:** GPL-3.0-or-later
- **Catalog description:** Yet Another Dotfiles Manager
## Procedure
1. Confirm the tool is available.
   - `command -v yadm`
   - `yadm --version` (fallback: `yadm -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search yadm` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search yadm` then install the matching package.
   - Fedora/RHEL: `dnf search yadm` then install the matching package.
3. Inspect supported commands/options.
   - `yadm --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
