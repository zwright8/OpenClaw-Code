---
name: stylish-haskell
description: "Run and troubleshoot the stylish-haskell command-line tool on local machines. Use when requests mention \"stylish-haskell\" or require workflows supported by this tool."
---

# stylish-haskell

Use this skill to execute **stylish-haskell** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2484 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/haskell/stylish-haskell
- **License:** BSD-3-Clause
- **Catalog description:** Haskell code prettifier
## Procedure
1. Confirm the tool is available.
   - `command -v stylish-haskell`
   - `stylish-haskell --version` (fallback: `stylish-haskell -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search stylish-haskell` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search stylish-haskell` then install the matching package.
   - Fedora/RHEL: `dnf search stylish-haskell` then install the matching package.
3. Inspect supported commands/options.
   - `stylish-haskell --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
