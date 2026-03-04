---
name: cunit
description: "Run and troubleshoot the cunit command-line tool on local machines. Use when requests mention \"cunit\" or require workflows supported by this tool."
---

# cunit

Use this skill to execute **cunit** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2365 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://cunit.sourceforge.net/
- **License:** LGPL-2.0-or-later
- **Catalog description:** Lightweight unit testing framework for C
## Procedure
1. Confirm the tool is available.
   - `command -v cunit`
   - `cunit --version` (fallback: `cunit -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search cunit` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search cunit` then install the matching package.
   - Fedora/RHEL: `dnf search cunit` then install the matching package.
3. Inspect supported commands/options.
   - `cunit --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
