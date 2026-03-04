---
name: libvirt-python
description: "Run and troubleshoot the libvirt-python command-line tool on local machines. Use when requests mention \"libvirt-python\" or require workflows supported by this tool."
---

# libvirt-python

Use this skill to execute **libvirt-python** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2133 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.libvirt.org/
- **License:** LGPL-2.1-or-later
- **Catalog description:** Libvirt virtualization API python binding
## Procedure
1. Confirm the tool is available.
   - `command -v libvirt-python`
   - `libvirt-python --version` (fallback: `libvirt-python -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libvirt-python` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libvirt-python` then install the matching package.
   - Fedora/RHEL: `dnf search libvirt-python` then install the matching package.
3. Inspect supported commands/options.
   - `libvirt-python --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
