---
name: log4cxx
description: "Run and troubleshoot the log4cxx command-line tool on local machines. Use when requests mention \"log4cxx\" or require workflows supported by this tool."
---

# log4cxx

Use this skill to execute **log4cxx** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2215 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://logging.apache.org/log4cxx/index.html
- **License:** Apache-2.0
- **Catalog description:** Library of C++ classes for flexible logging
## Procedure
1. Confirm the tool is available.
   - `command -v log4cxx`
   - `log4cxx --version` (fallback: `log4cxx -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search log4cxx` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search log4cxx` then install the matching package.
   - Fedora/RHEL: `dnf search log4cxx` then install the matching package.
3. Inspect supported commands/options.
   - `log4cxx --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
