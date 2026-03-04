---
name: gitu
description: "Run and troubleshoot the gitu command-line tool on local machines. Use when requests mention \"gitu\" or require workflows supported by this tool."
---

# gitu

Use this skill to execute **gitu** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2308 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/altsem/gitu
- **License:** MIT
- **Catalog description:** TUI Git client inspired by Magit
## Procedure
1. Confirm the tool is available.
   - `command -v gitu`
   - `gitu --version` (fallback: `gitu -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gitu` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gitu` then install the matching package.
   - Fedora/RHEL: `dnf search gitu` then install the matching package.
3. Inspect supported commands/options.
   - `gitu --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
