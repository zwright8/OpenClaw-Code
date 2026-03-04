---
name: corepack
description: "Run and troubleshoot the corepack command-line tool on local machines. Use when requests mention \"corepack\" or require workflows supported by this tool."
---

# corepack

Use this skill to execute **corepack** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2110 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/nodejs/corepack
- **License:** MIT
- **Catalog description:** Package acting as bridge between Node projects and their package managers
## Procedure
1. Confirm the tool is available.
   - `command -v corepack`
   - `corepack --version` (fallback: `corepack -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search corepack` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search corepack` then install the matching package.
   - Fedora/RHEL: `dnf search corepack` then install the matching package.
3. Inspect supported commands/options.
   - `corepack --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
