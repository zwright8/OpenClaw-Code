---
name: nicotine-plus
description: "Run and troubleshoot the nicotine-plus command-line tool on local machines. Use when requests mention \"nicotine-plus\" or require workflows supported by this tool."
---

# nicotine-plus

Use this skill to execute **nicotine-plus** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2435 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://nicotine-plus.org
- **License:** GPL-3.0-or-later
- **Catalog description:** Graphical client for the Soulseek peer-to-peer network
## Procedure
1. Confirm the tool is available.
   - `command -v nicotine-plus`
   - `nicotine-plus --version` (fallback: `nicotine-plus -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search nicotine-plus` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search nicotine-plus` then install the matching package.
   - Fedora/RHEL: `dnf search nicotine-plus` then install the matching package.
3. Inspect supported commands/options.
   - `nicotine-plus --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
