---
name: vdirsyncer
description: "Run and troubleshoot the vdirsyncer command-line tool on local machines. Use when requests mention \"vdirsyncer\" or require workflows supported by this tool."
---

# vdirsyncer

Use this skill to execute **vdirsyncer** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2430 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/pimutils/vdirsyncer
- **License:** BSD-3-Clause
- **Catalog description:** Synchronize calendars and contacts
## Procedure
1. Confirm the tool is available.
   - `command -v vdirsyncer`
   - `vdirsyncer --version` (fallback: `vdirsyncer -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search vdirsyncer` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search vdirsyncer` then install the matching package.
   - Fedora/RHEL: `dnf search vdirsyncer` then install the matching package.
3. Inspect supported commands/options.
   - `vdirsyncer --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
