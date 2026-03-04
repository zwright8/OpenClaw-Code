---
name: vde
description: "Run and troubleshoot the vde command-line tool on local machines. Use when requests mention \"vde\" or require workflows supported by this tool."
---

# vde

Use this skill to execute **vde** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2158 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/virtualsquare/vde-2
- **License:** GPL-2.0-or-later AND LGPL-2.1-or-later
- **Catalog description:** Ethernet compliant virtual network
## Procedure
1. Confirm the tool is available.
   - `command -v vde`
   - `vde --version` (fallback: `vde -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search vde` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search vde` then install the matching package.
   - Fedora/RHEL: `dnf search vde` then install the matching package.
3. Inspect supported commands/options.
   - `vde --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
