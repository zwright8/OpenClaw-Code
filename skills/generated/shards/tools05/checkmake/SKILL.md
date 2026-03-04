---
name: checkmake
description: "Run and troubleshoot the checkmake command-line tool on local machines. Use when requests mention \"checkmake\" or require workflows supported by this tool."
---

# checkmake

Use this skill to execute **checkmake** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2118 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/checkmake/checkmake
- **License:** MIT
- **Catalog description:** Linter/analyzer for Makefiles
## Procedure
1. Confirm the tool is available.
   - `command -v checkmake`
   - `checkmake --version` (fallback: `checkmake -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search checkmake` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search checkmake` then install the matching package.
   - Fedora/RHEL: `dnf search checkmake` then install the matching package.
3. Inspect supported commands/options.
   - `checkmake --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
