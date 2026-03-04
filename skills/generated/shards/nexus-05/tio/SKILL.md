---
name: tio
description: "Run and troubleshoot the tio command-line tool on local machines. Use when requests mention \"tio\" or require workflows supported by this tool."
---

# tio

Use this skill to execute **tio** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2206 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://tio.github.io
- **License:** GPL-2.0-or-later
- **Catalog description:** Simple TTY terminal I/O application
## Procedure
1. Confirm the tool is available.
   - `command -v tio`
   - `tio --version` (fallback: `tio -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search tio` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search tio` then install the matching package.
   - Fedora/RHEL: `dnf search tio` then install the matching package.
3. Inspect supported commands/options.
   - `tio --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
