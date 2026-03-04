---
name: cbonsai
description: "Run and troubleshoot the cbonsai command-line tool on local machines. Use when requests mention \"cbonsai\" or require workflows supported by this tool."
---

# cbonsai

Use this skill to execute **cbonsai** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2066 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gitlab.com/jallbrit/cbonsai
- **License:** GPL-3.0-or-later
- **Catalog description:** Console Bonsai is a bonsai tree generator, written in C using ncurses
## Procedure
1. Confirm the tool is available.
   - `command -v cbonsai`
   - `cbonsai --version` (fallback: `cbonsai -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search cbonsai` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search cbonsai` then install the matching package.
   - Fedora/RHEL: `dnf search cbonsai` then install the matching package.
3. Inspect supported commands/options.
   - `cbonsai --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
