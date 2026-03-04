---
name: gflags
description: "Run and troubleshoot the gflags command-line tool on local machines. Use when requests mention \"gflags\" or require workflows supported by this tool."
---

# gflags

Use this skill to execute **gflags** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2136 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gflags.github.io/gflags/
- **License:** BSD-3-Clause
- **Catalog description:** Library for processing command-line flags
## Procedure
1. Confirm the tool is available.
   - `command -v gflags`
   - `gflags --version` (fallback: `gflags -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gflags` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gflags` then install the matching package.
   - Fedora/RHEL: `dnf search gflags` then install the matching package.
3. Inspect supported commands/options.
   - `gflags --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
