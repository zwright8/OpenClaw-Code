---
name: gotop
description: "Run and troubleshoot the gotop command-line tool on local machines. Use when requests mention \"gotop\" or require workflows supported by this tool."
---

# gotop

Use this skill to execute **gotop** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2472 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/xxxserxxx/gotop
- **License:** BSD-3-Clause
- **Catalog description:** Terminal based graphical activity monitor inspired by gtop and vtop
## Procedure
1. Confirm the tool is available.
   - `command -v gotop`
   - `gotop --version` (fallback: `gotop -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gotop` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gotop` then install the matching package.
   - Fedora/RHEL: `dnf search gotop` then install the matching package.
3. Inspect supported commands/options.
   - `gotop --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
