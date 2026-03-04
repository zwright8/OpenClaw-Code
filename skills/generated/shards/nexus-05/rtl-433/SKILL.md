---
name: rtl-433
description: "Run and troubleshoot the rtl_433 command-line tool on local machines. Use when requests mention \"rtl_433\" or require workflows supported by this tool."
---

# rtl_433

Use this skill to execute **rtl_433** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2250 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/merbanan/rtl_433
- **License:** GPL-2.0-or-later
- **Catalog description:** Program to decode radio transmissions from devices
## Procedure
1. Confirm the tool is available.
   - `command -v rtl_433`
   - `rtl_433 --version` (fallback: `rtl_433 -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search rtl_433` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search rtl_433` then install the matching package.
   - Fedora/RHEL: `dnf search rtl_433` then install the matching package.
3. Inspect supported commands/options.
   - `rtl_433 --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
