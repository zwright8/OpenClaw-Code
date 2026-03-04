---
name: screenfetch
description: "Run and troubleshoot the screenfetch command-line tool on local machines. Use when requests mention \"screenfetch\" or require workflows supported by this tool."
---

# screenfetch

Use this skill to execute **screenfetch** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2081 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/KittyKatt/screenFetch
- **License:** GPL-3.0-or-later
- **Catalog description:** Generate ASCII art with terminal, shell, and OS info
## Procedure
1. Confirm the tool is available.
   - `command -v screenfetch`
   - `screenfetch --version` (fallback: `screenfetch -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search screenfetch` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search screenfetch` then install the matching package.
   - Fedora/RHEL: `dnf search screenfetch` then install the matching package.
3. Inspect supported commands/options.
   - `screenfetch --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
