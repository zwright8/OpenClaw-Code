---
name: srtp
description: "Run and troubleshoot the srtp command-line tool on local machines. Use when requests mention \"srtp\" or require workflows supported by this tool."
---

# srtp

Use this skill to execute **srtp** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2342 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/cisco/libsrtp
- **License:** BSD-3-Clause
- **Catalog description:** Implementation of the Secure Real-time Transport Protocol
## Procedure
1. Confirm the tool is available.
   - `command -v srtp`
   - `srtp --version` (fallback: `srtp -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search srtp` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search srtp` then install the matching package.
   - Fedora/RHEL: `dnf search srtp` then install the matching package.
3. Inspect supported commands/options.
   - `srtp --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
