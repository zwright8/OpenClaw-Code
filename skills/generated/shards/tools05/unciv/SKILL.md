---
name: unciv
description: "Run and troubleshoot the unciv command-line tool on local machines. Use when requests mention \"unciv\" or require workflows supported by this tool."
---

# unciv

Use this skill to execute **unciv** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2340 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/yairm210/Unciv
- **License:** MPL-2.0
- **Catalog description:** Open-source Android/Desktop remake of Civ V
## Procedure
1. Confirm the tool is available.
   - `command -v unciv`
   - `unciv --version` (fallback: `unciv -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search unciv` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search unciv` then install the matching package.
   - Fedora/RHEL: `dnf search unciv` then install the matching package.
3. Inspect supported commands/options.
   - `unciv --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
