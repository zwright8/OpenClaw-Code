---
name: sshs
description: "Run and troubleshoot the sshs command-line tool on local machines. Use when requests mention \"sshs\" or require workflows supported by this tool."
---

# sshs

Use this skill to execute **sshs** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2232 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/quantumsheep/sshs
- **License:** MIT
- **Catalog description:** Graphical command-line client for SSH
## Procedure
1. Confirm the tool is available.
   - `command -v sshs`
   - `sshs --version` (fallback: `sshs -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search sshs` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search sshs` then install the matching package.
   - Fedora/RHEL: `dnf search sshs` then install the matching package.
3. Inspect supported commands/options.
   - `sshs --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
