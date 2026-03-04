---
name: rtabmap
description: "Run and troubleshoot the rtabmap command-line tool on local machines. Use when requests mention \"rtabmap\" or require workflows supported by this tool."
---

# rtabmap

Use this skill to execute **rtabmap** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2494 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://introlab.github.io/rtabmap
- **License:** BSD-3-Clause
- **Catalog description:** Visual and LiDAR SLAM library and standalone application
## Procedure
1. Confirm the tool is available.
   - `command -v rtabmap`
   - `rtabmap --version` (fallback: `rtabmap -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search rtabmap` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search rtabmap` then install the matching package.
   - Fedora/RHEL: `dnf search rtabmap` then install the matching package.
3. Inspect supported commands/options.
   - `rtabmap --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
