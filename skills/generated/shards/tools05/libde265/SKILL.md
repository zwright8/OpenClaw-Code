---
name: libde265
description: "Run and troubleshoot the libde265 command-line tool on local machines. Use when requests mention \"libde265\" or require workflows supported by this tool."
---

# libde265

Use this skill to execute **libde265** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2070 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/strukturag/libde265
- **License:** LGPL-3.0-or-later
- **Catalog description:** Open h.265 video codec implementation
## Procedure
1. Confirm the tool is available.
   - `command -v libde265`
   - `libde265 --version` (fallback: `libde265 -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libde265` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libde265` then install the matching package.
   - Fedora/RHEL: `dnf search libde265` then install the matching package.
3. Inspect supported commands/options.
   - `libde265 --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
