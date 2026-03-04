---
name: nspr
description: "Run and troubleshoot the nspr command-line tool on local machines. Use when requests mention \"nspr\" or require workflows supported by this tool."
---

# nspr

Use this skill to execute **nspr** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2082 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://hg.mozilla.org/projects/nspr
- **License:** MPL-2.0
- **Catalog description:** Platform-neutral API for system-level and libc-like functions
## Procedure
1. Confirm the tool is available.
   - `command -v nspr`
   - `nspr --version` (fallback: `nspr -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search nspr` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search nspr` then install the matching package.
   - Fedora/RHEL: `dnf search nspr` then install the matching package.
3. Inspect supported commands/options.
   - `nspr --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
