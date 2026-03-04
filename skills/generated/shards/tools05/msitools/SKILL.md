---
name: msitools
description: "Run and troubleshoot the msitools command-line tool on local machines. Use when requests mention \"msitools\" or require workflows supported by this tool."
---

# msitools

Use this skill to execute **msitools** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2326 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://wiki.gnome.org/msitools
- **License:** LGPL-2.1-or-later
- **Catalog description:** Windows installer (.MSI) tool
## Procedure
1. Confirm the tool is available.
   - `command -v msitools`
   - `msitools --version` (fallback: `msitools -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search msitools` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search msitools` then install the matching package.
   - Fedora/RHEL: `dnf search msitools` then install the matching package.
3. Inspect supported commands/options.
   - `msitools --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
