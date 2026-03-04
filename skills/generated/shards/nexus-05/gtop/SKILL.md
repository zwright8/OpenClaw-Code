---
name: gtop
description: "Run and troubleshoot the gtop command-line tool on local machines. Use when requests mention \"gtop\" or require workflows supported by this tool."
---

# gtop

Use this skill to execute **gtop** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2448 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/aksakalli/gtop
- **License:** MIT
- **Catalog description:** System monitoring dashboard for terminal
## Procedure
1. Confirm the tool is available.
   - `command -v gtop`
   - `gtop --version` (fallback: `gtop -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gtop` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gtop` then install the matching package.
   - Fedora/RHEL: `dnf search gtop` then install the matching package.
3. Inspect supported commands/options.
   - `gtop --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
