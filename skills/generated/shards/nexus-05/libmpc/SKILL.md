---
name: libmpc
description: "Run and troubleshoot the libmpc command-line tool on local machines. Use when requests mention \"libmpc\" or require workflows supported by this tool."
---

# libmpc

Use this skill to execute **libmpc** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2156 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.multiprecision.org/
- **License:** LGPL-3.0-or-later
- **Catalog description:** C library for the arithmetic of high precision complex numbers
## Procedure
1. Confirm the tool is available.
   - `command -v libmpc`
   - `libmpc --version` (fallback: `libmpc -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libmpc` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libmpc` then install the matching package.
   - Fedora/RHEL: `dnf search libmpc` then install the matching package.
3. Inspect supported commands/options.
   - `libmpc --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
