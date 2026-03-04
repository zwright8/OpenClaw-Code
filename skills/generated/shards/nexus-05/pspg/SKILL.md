---
name: pspg
description: "Run and troubleshoot the pspg command-line tool on local machines. Use when requests mention \"pspg\" or require workflows supported by this tool."
---

# pspg

Use this skill to execute **pspg** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2324 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/okbob/pspg
- **License:** BSD-2-Clause
- **Catalog description:** Unix pager optimized for psql
## Procedure
1. Confirm the tool is available.
   - `command -v pspg`
   - `pspg --version` (fallback: `pspg -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search pspg` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search pspg` then install the matching package.
   - Fedora/RHEL: `dnf search pspg` then install the matching package.
3. Inspect supported commands/options.
   - `pspg --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
