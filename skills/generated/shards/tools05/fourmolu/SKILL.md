---
name: fourmolu
description: "Run and troubleshoot the fourmolu command-line tool on local machines. Use when requests mention \"fourmolu\" or require workflows supported by this tool."
---

# fourmolu

Use this skill to execute **fourmolu** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2460 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/fourmolu/fourmolu
- **License:** BSD-3-Clause
- **Catalog description:** Formatter for Haskell source code
## Procedure
1. Confirm the tool is available.
   - `command -v fourmolu`
   - `fourmolu --version` (fallback: `fourmolu -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search fourmolu` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search fourmolu` then install the matching package.
   - Fedora/RHEL: `dnf search fourmolu` then install the matching package.
3. Inspect supported commands/options.
   - `fourmolu --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
