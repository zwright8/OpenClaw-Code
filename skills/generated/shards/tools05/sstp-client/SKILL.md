---
name: sstp-client
description: "Run and troubleshoot the sstp-client command-line tool on local machines. Use when requests mention \"sstp-client\" or require workflows supported by this tool."
---

# sstp-client

Use this skill to execute **sstp-client** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2348 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gitlab.com/sstp-project/sstp-client
- **License:** GPL-2.0-or-later
- **Catalog description:** SSTP (Microsoft's Remote Access Solution for PPP over SSL) client
## Procedure
1. Confirm the tool is available.
   - `command -v sstp-client`
   - `sstp-client --version` (fallback: `sstp-client -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search sstp-client` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search sstp-client` then install the matching package.
   - Fedora/RHEL: `dnf search sstp-client` then install the matching package.
3. Inspect supported commands/options.
   - `sstp-client --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
