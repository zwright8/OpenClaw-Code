---
name: libfaketime
description: "Run and troubleshoot the libfaketime command-line tool on local machines. Use when requests mention \"libfaketime\" or require workflows supported by this tool."
---

# libfaketime

Use this skill to execute **libfaketime** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2107 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/wolfcw/libfaketime
- **License:** GPL-2.0-only
- **Catalog description:** Report faked system time to programs
## Procedure
1. Confirm the tool is available.
   - `command -v libfaketime`
   - `libfaketime --version` (fallback: `libfaketime -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libfaketime` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libfaketime` then install the matching package.
   - Fedora/RHEL: `dnf search libfaketime` then install the matching package.
3. Inspect supported commands/options.
   - `libfaketime --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
