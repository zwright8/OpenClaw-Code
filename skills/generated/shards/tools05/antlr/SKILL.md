---
name: antlr
description: "Run and troubleshoot the antlr command-line tool on local machines. Use when requests mention \"antlr\" or require workflows supported by this tool."
---

# antlr

Use this skill to execute **antlr** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2428 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.antlr.org/
- **License:** BSD-3-Clause
- **Catalog description:** ANother Tool for Language Recognition
## Procedure
1. Confirm the tool is available.
   - `command -v antlr`
   - `antlr --version` (fallback: `antlr -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search antlr` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search antlr` then install the matching package.
   - Fedora/RHEL: `dnf search antlr` then install the matching package.
3. Inspect supported commands/options.
   - `antlr --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
