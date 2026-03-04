---
name: taskwarrior-tui
description: "Run and troubleshoot the taskwarrior-tui command-line tool on local machines. Use when requests mention \"taskwarrior-tui\" or require workflows supported by this tool."
---

# taskwarrior-tui

Use this skill to execute **taskwarrior-tui** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2194 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://kdheepak.com/taskwarrior-tui/
- **License:** MIT
- **Catalog description:** Terminal user interface for taskwarrior
## Procedure
1. Confirm the tool is available.
   - `command -v taskwarrior-tui`
   - `taskwarrior-tui --version` (fallback: `taskwarrior-tui -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search taskwarrior-tui` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search taskwarrior-tui` then install the matching package.
   - Fedora/RHEL: `dnf search taskwarrior-tui` then install the matching package.
3. Inspect supported commands/options.
   - `taskwarrior-tui --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
