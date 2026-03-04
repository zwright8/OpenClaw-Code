---
name: fossil
description: "Run and troubleshoot the fossil command-line tool on local machines. Use when requests mention \"fossil\" or require workflows supported by this tool."
---

# fossil

Use this skill to execute **fossil** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2121 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.fossil-scm.org/home/
- **License:** BSD-2-Clause
- **Catalog description:** Distributed software configuration management
## Procedure
1. Confirm the tool is available.
   - `command -v fossil`
   - `fossil --version` (fallback: `fossil -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search fossil` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search fossil` then install the matching package.
   - Fedora/RHEL: `dnf search fossil` then install the matching package.
3. Inspect supported commands/options.
   - `fossil --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
