---
name: libusb-compat
description: "Run and troubleshoot the libusb-compat command-line tool on local machines. Use when requests mention \"libusb-compat\" or require workflows supported by this tool."
---

# libusb-compat

Use this skill to execute **libusb-compat** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2097 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://libusb.info/
- **License:** LGPL-2.1-or-later AND (LGPL-2.1-or-later OR BSD-3-Clause)
- **Catalog description:** Library for USB device access
## Procedure
1. Confirm the tool is available.
   - `command -v libusb-compat`
   - `libusb-compat --version` (fallback: `libusb-compat -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libusb-compat` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libusb-compat` then install the matching package.
   - Fedora/RHEL: `dnf search libusb-compat` then install the matching package.
3. Inspect supported commands/options.
   - `libusb-compat --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
