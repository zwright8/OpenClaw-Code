---
name: liblinear
description: "Run and troubleshoot the liblinear command-line tool on local machines. Use when requests mention \"liblinear\" or require workflows supported by this tool."
---

# liblinear

Use this skill to execute **liblinear** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2238 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.csie.ntu.edu.tw/~cjlin/liblinear/
- **License:** BSD-3-Clause
- **Catalog description:** Library for large linear classification
## Procedure
1. Confirm the tool is available.
   - `command -v liblinear`
   - `liblinear --version` (fallback: `liblinear -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search liblinear` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search liblinear` then install the matching package.
   - Fedora/RHEL: `dnf search liblinear` then install the matching package.
3. Inspect supported commands/options.
   - `liblinear --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
