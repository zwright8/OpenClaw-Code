---
name: librealsense
description: "Run and troubleshoot the librealsense command-line tool on local machines. Use when requests mention \"librealsense\" or require workflows supported by this tool."
---

# librealsense

Use this skill to execute **librealsense** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2368 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/IntelRealSense/librealsense
- **License:** Apache-2.0
- **Catalog description:** Intel RealSense D400 series and SR300 capture
## Procedure
1. Confirm the tool is available.
   - `command -v librealsense`
   - `librealsense --version` (fallback: `librealsense -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search librealsense` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search librealsense` then install the matching package.
   - Fedora/RHEL: `dnf search librealsense` then install the matching package.
3. Inspect supported commands/options.
   - `librealsense --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
