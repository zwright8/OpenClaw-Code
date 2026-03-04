---
name: sqlite-analyzer
description: "Run and troubleshoot the sqlite-analyzer command-line tool on local machines. Use when requests mention \"sqlite-analyzer\" or require workflows supported by this tool."
---

# sqlite-analyzer

Use this skill to execute **sqlite-analyzer** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2371 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.sqlite.org/
- **License:** blessing
- **Catalog description:** Analyze how space is allocated inside an SQLite file
## Procedure
1. Confirm the tool is available.
   - `command -v sqlite-analyzer`
   - `sqlite-analyzer --version` (fallback: `sqlite-analyzer -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search sqlite-analyzer` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search sqlite-analyzer` then install the matching package.
   - Fedora/RHEL: `dnf search sqlite-analyzer` then install the matching package.
3. Inspect supported commands/options.
   - `sqlite-analyzer --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
