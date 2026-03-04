---
name: httping
description: "Run and troubleshoot the httping command-line tool on local machines. Use when requests mention \"httping\" or require workflows supported by this tool."
---

# httping

Use this skill to execute **httping** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2023 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/folkertvanheusden/HTTPing
- **License:** AGPL-3.0-only
- **Catalog description:** Ping-like tool for HTTP requests
## Procedure
1. Confirm the tool is available.
   - `command -v httping`
   - `httping --version` (fallback: `httping -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search httping` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search httping` then install the matching package.
   - Fedora/RHEL: `dnf search httping` then install the matching package.
3. Inspect supported commands/options.
   - `httping --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
