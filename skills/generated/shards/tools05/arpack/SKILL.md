---
name: arpack
description: "Run and troubleshoot the arpack command-line tool on local machines. Use when requests mention \"arpack\" or require workflows supported by this tool."
---

# arpack

Use this skill to execute **arpack** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2243 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/opencollab/arpack-ng
- **License:** BSD-3-Clause
- **Catalog description:** Routines to solve large scale eigenvalue problems
## Procedure
1. Confirm the tool is available.
   - `command -v arpack`
   - `arpack --version` (fallback: `arpack -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search arpack` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search arpack` then install the matching package.
   - Fedora/RHEL: `dnf search arpack` then install the matching package.
3. Inspect supported commands/options.
   - `arpack --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
