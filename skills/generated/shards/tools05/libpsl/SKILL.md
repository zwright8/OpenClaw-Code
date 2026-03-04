---
name: libpsl
description: "Run and troubleshoot the libpsl command-line tool on local machines. Use when requests mention \"libpsl\" or require workflows supported by this tool."
---

# libpsl

Use this skill to execute **libpsl** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2170 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://rockdaboot.github.io/libpsl
- **License:** MIT
- **Catalog description:** C library for the Public Suffix List
## Procedure
1. Confirm the tool is available.
   - `command -v libpsl`
   - `libpsl --version` (fallback: `libpsl -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libpsl` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libpsl` then install the matching package.
   - Fedora/RHEL: `dnf search libpsl` then install the matching package.
3. Inspect supported commands/options.
   - `libpsl --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
