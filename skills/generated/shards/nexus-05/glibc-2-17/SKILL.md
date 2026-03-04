---
name: glibc-2-17
description: "Run and troubleshoot the glibc@2.17 command-line tool on local machines. Use when requests mention \"glibc@2.17\" or require workflows supported by this tool."
---

# glibc@2.17

Use this skill to execute **glibc@2.17** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2115 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.gnu.org/software/libc/
- **License:** GPL-2.0-or-later AND LGPL-2.1-or-later
- **Catalog description:** GNU C Library
- **Executable hint:** package/catalog name is `glibc@2.17`, while the runnable binary is often `glibc`.
## Procedure
1. Confirm the tool is available.
   - `command -v glibc`
   - `glibc --version` (fallback: `glibc -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search glibc@2.17` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search glibc@2.17` then install the matching package.
   - Fedora/RHEL: `dnf search glibc@2.17` then install the matching package.
3. Inspect supported commands/options.
   - `glibc --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
