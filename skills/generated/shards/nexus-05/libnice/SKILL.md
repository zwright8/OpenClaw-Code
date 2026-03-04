---
name: libnice
description: "Run and troubleshoot the libnice command-line tool on local machines. Use when requests mention \"libnice\" or require workflows supported by this tool."
---

# libnice

Use this skill to execute **libnice** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2247 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://wiki.freedesktop.org/nice/
- **License:** LGPL-2.1-only OR MPL-1.1
- **Catalog description:** GLib ICE implementation
## Procedure
1. Confirm the tool is available.
   - `command -v libnice`
   - `libnice --version` (fallback: `libnice -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libnice` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libnice` then install the matching package.
   - Fedora/RHEL: `dnf search libnice` then install the matching package.
3. Inspect supported commands/options.
   - `libnice --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
