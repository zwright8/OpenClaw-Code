---
name: mlt
description: "Run and troubleshoot the mlt command-line tool on local machines. Use when requests mention \"mlt\" or require workflows supported by this tool."
---

# mlt

Use this skill to execute **mlt** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2328 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.mltframework.org/
- **License:** LGPL-2.1-only
- **Catalog description:** Author, manage, and run multitrack audio/video compositions
## Procedure
1. Confirm the tool is available.
   - `command -v mlt`
   - `mlt --version` (fallback: `mlt -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mlt` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mlt` then install the matching package.
   - Fedora/RHEL: `dnf search mlt` then install the matching package.
3. Inspect supported commands/options.
   - `mlt --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
