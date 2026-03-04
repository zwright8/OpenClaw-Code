---
name: ettercap
description: "Run and troubleshoot the ettercap command-line tool on local machines. Use when requests mention \"ettercap\" or require workflows supported by this tool."
---

# ettercap

Use this skill to execute **ettercap** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2420 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://ettercap.github.io/ettercap/
- **License:** GPL-2.0-or-later
- **Catalog description:** Multipurpose sniffer/interceptor/logger for switched LAN
## Procedure
1. Confirm the tool is available.
   - `command -v ettercap`
   - `ettercap --version` (fallback: `ettercap -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ettercap` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ettercap` then install the matching package.
   - Fedora/RHEL: `dnf search ettercap` then install the matching package.
3. Inspect supported commands/options.
   - `ettercap --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
