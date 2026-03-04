---
name: libsoup-2
description: "Run and troubleshoot the libsoup@2 command-line tool on local machines. Use when requests mention \"libsoup@2\" or require workflows supported by this tool."
---

# libsoup@2

Use this skill to execute **libsoup@2** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2325 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://wiki.gnome.org/Projects/libsoup
- **License:** LGPL-2.0-or-later
- **Catalog description:** HTTP client/server library for GNOME
- **Executable hint:** package/catalog name is `libsoup@2`, while the runnable binary is often `libsoup`.
## Procedure
1. Confirm the tool is available.
   - `command -v libsoup`
   - `libsoup --version` (fallback: `libsoup -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libsoup@2` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libsoup@2` then install the matching package.
   - Fedora/RHEL: `dnf search libsoup@2` then install the matching package.
3. Inspect supported commands/options.
   - `libsoup --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
