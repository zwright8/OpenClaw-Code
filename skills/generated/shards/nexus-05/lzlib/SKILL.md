---
name: lzlib
description: "Run and troubleshoot the lzlib command-line tool on local machines. Use when requests mention \"lzlib\" or require workflows supported by this tool."
---

# lzlib

Use this skill to execute **lzlib** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2080 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.nongnu.org/lzip/lzlib.html
- **License:** BSD-2-Clause
- **Catalog description:** Data compression library
## Procedure
1. Confirm the tool is available.
   - `command -v lzlib`
   - `lzlib --version` (fallback: `lzlib -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search lzlib` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search lzlib` then install the matching package.
   - Fedora/RHEL: `dnf search lzlib` then install the matching package.
3. Inspect supported commands/options.
   - `lzlib --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
