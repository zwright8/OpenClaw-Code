---
name: pie
description: "Run and troubleshoot the pie command-line tool on local machines. Use when requests mention \"pie\" or require workflows supported by this tool."
---

# pie

Use this skill to execute **pie** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2378 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/php/pie
- **License:** BSD-3-Clause
- **Catalog description:** PHP Installer for Extensions
## Procedure
1. Confirm the tool is available.
   - `command -v pie`
   - `pie --version` (fallback: `pie -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search pie` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search pie` then install the matching package.
   - Fedora/RHEL: `dnf search pie` then install the matching package.
3. Inspect supported commands/options.
   - `pie --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
