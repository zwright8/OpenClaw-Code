---
name: futhark
description: "Run and troubleshoot the futhark command-line tool on local machines. Use when requests mention \"futhark\" or require workflows supported by this tool."
---

# futhark

Use this skill to execute **futhark** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2132 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://futhark-lang.org/
- **License:** ISC
- **Catalog description:** Data-parallel functional programming language
## Procedure
1. Confirm the tool is available.
   - `command -v futhark`
   - `futhark --version` (fallback: `futhark -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search futhark` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search futhark` then install the matching package.
   - Fedora/RHEL: `dnf search futhark` then install the matching package.
3. Inspect supported commands/options.
   - `futhark --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
