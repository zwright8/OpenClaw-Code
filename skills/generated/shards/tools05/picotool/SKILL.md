---
name: picotool
description: "Run and troubleshoot the picotool command-line tool on local machines. Use when requests mention \"picotool\" or require workflows supported by this tool."
---

# picotool

Use this skill to execute **picotool** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2364 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/raspberrypi/picotool
- **License:** BSD-3-Clause
- **Catalog description:** Tool for interacting with RP2040/RP2350 devices and binaries
## Procedure
1. Confirm the tool is available.
   - `command -v picotool`
   - `picotool --version` (fallback: `picotool -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search picotool` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search picotool` then install the matching package.
   - Fedora/RHEL: `dnf search picotool` then install the matching package.
3. Inspect supported commands/options.
   - `picotool --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
