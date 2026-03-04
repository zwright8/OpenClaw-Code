---
name: xrootd
description: "Run and troubleshoot the xrootd command-line tool on local machines. Use when requests mention \"xrootd\" or require workflows supported by this tool."
---

# xrootd

Use this skill to execute **xrootd** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2311 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://xrootd.slac.stanford.edu/
- **License:** LGPL-3.0-or-later
- **Catalog description:** High performance, scalable, fault-tolerant access to data
## Procedure
1. Confirm the tool is available.
   - `command -v xrootd`
   - `xrootd --version` (fallback: `xrootd -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search xrootd` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search xrootd` then install the matching package.
   - Fedora/RHEL: `dnf search xrootd` then install the matching package.
3. Inspect supported commands/options.
   - `xrootd --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
