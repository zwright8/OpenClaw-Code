---
name: libtorrent-rasterbar
description: "Run and troubleshoot the libtorrent-rasterbar command-line tool on local machines. Use when requests mention \"libtorrent-rasterbar\" or require workflows supported by this tool."
---

# libtorrent-rasterbar

Use this skill to execute **libtorrent-rasterbar** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2167 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.libtorrent.org/
- **License:** BSD-3-Clause
- **Catalog description:** C++ bittorrent library with Python bindings
## Procedure
1. Confirm the tool is available.
   - `command -v libtorrent-rasterbar`
   - `libtorrent-rasterbar --version` (fallback: `libtorrent-rasterbar -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libtorrent-rasterbar` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libtorrent-rasterbar` then install the matching package.
   - Fedora/RHEL: `dnf search libtorrent-rasterbar` then install the matching package.
3. Inspect supported commands/options.
   - `libtorrent-rasterbar --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
