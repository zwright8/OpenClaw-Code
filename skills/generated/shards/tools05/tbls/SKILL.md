---
name: tbls
description: "Run and troubleshoot the tbls command-line tool on local machines. Use when requests mention \"tbls\" or require workflows supported by this tool."
---

# tbls

Use this skill to execute **tbls** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2126 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/k1LoW/tbls
- **License:** MIT
- **Catalog description:** CI-Friendly tool to document a database
## Procedure
1. Confirm the tool is available.
   - `command -v tbls`
   - `tbls --version` (fallback: `tbls -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search tbls` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search tbls` then install the matching package.
   - Fedora/RHEL: `dnf search tbls` then install the matching package.
3. Inspect supported commands/options.
   - `tbls --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
