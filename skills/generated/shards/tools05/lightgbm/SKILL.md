---
name: lightgbm
description: "Run and troubleshoot the lightgbm command-line tool on local machines. Use when requests mention \"lightgbm\" or require workflows supported by this tool."
---

# lightgbm

Use this skill to execute **lightgbm** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2225 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/microsoft/LightGBM
- **License:** MIT
- **Catalog description:** Fast, distributed, high performance gradient boosting framework
## Procedure
1. Confirm the tool is available.
   - `command -v lightgbm`
   - `lightgbm --version` (fallback: `lightgbm -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search lightgbm` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search lightgbm` then install the matching package.
   - Fedora/RHEL: `dnf search lightgbm` then install the matching package.
3. Inspect supported commands/options.
   - `lightgbm --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
