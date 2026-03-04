---
name: libgphoto2
description: "Run and troubleshoot the libgphoto2 command-line tool on local machines. Use when requests mention \"libgphoto2\" or require workflows supported by this tool."
---

# libgphoto2

Use this skill to execute **libgphoto2** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2327 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** http://www.gphoto.org/proj/libgphoto2/
- **License:** LGPL-2.1-or-later
- **Catalog description:** Gphoto2 digital camera library
## Procedure
1. Confirm the tool is available.
   - `command -v libgphoto2`
   - `libgphoto2 --version` (fallback: `libgphoto2 -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libgphoto2` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libgphoto2` then install the matching package.
   - Fedora/RHEL: `dnf search libgphoto2` then install the matching package.
3. Inspect supported commands/options.
   - `libgphoto2 --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
