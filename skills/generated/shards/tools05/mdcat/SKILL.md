---
name: mdcat
description: "Run and troubleshoot the mdcat command-line tool on local machines. Use when requests mention \"mdcat\" or require workflows supported by this tool."
---

# mdcat

Use this skill to execute **mdcat** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2290 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/swsnr/mdcat
- **License:** MPL-2.0
- **Catalog description:** Show markdown documents on text terminals
## Procedure
1. Confirm the tool is available.
   - `command -v mdcat`
   - `mdcat --version` (fallback: `mdcat -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mdcat` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mdcat` then install the matching package.
   - Fedora/RHEL: `dnf search mdcat` then install the matching package.
3. Inspect supported commands/options.
   - `mdcat --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
