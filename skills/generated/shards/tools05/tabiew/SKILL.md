---
name: tabiew
description: "Run and troubleshoot the tabiew command-line tool on local machines. Use when requests mention \"tabiew\" or require workflows supported by this tool."
---

# tabiew

Use this skill to execute **tabiew** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2190 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/shshemi/tabiew
- **License:** MIT
- **Catalog description:** TUI to view and query tabular files (CSV,TSV, Parquet, etc.)
## Procedure
1. Confirm the tool is available.
   - `command -v tabiew`
   - `tabiew --version` (fallback: `tabiew -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search tabiew` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search tabiew` then install the matching package.
   - Fedora/RHEL: `dnf search tabiew` then install the matching package.
3. Inspect supported commands/options.
   - `tabiew --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
