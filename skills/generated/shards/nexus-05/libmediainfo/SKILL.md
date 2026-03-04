---
name: libmediainfo
description: "Run and troubleshoot the libmediainfo command-line tool on local machines. Use when requests mention \"libmediainfo\" or require workflows supported by this tool."
---

# libmediainfo

Use this skill to execute **libmediainfo** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2033 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://mediaarea.net/en/MediaInfo
- **License:** BSD-2-Clause
- **Catalog description:** Shared library for mediainfo
## Procedure
1. Confirm the tool is available.
   - `command -v libmediainfo`
   - `libmediainfo --version` (fallback: `libmediainfo -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libmediainfo` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libmediainfo` then install the matching package.
   - Fedora/RHEL: `dnf search libmediainfo` then install the matching package.
3. Inspect supported commands/options.
   - `libmediainfo --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
