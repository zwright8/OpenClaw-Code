---
name: libplacebo
description: "Run and troubleshoot the libplacebo command-line tool on local machines. Use when requests mention \"libplacebo\" or require workflows supported by this tool."
---

# libplacebo

Use this skill to execute **libplacebo** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2182 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://code.videolan.org/videolan/libplacebo
- **License:** LGPL-2.1-or-later
- **Catalog description:** Reusable library for GPU-accelerated image/video processing primitives
## Procedure
1. Confirm the tool is available.
   - `command -v libplacebo`
   - `libplacebo --version` (fallback: `libplacebo -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libplacebo` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libplacebo` then install the matching package.
   - Fedora/RHEL: `dnf search libplacebo` then install the matching package.
3. Inspect supported commands/options.
   - `libplacebo --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
