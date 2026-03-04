---
name: clingo
description: "Run and troubleshoot the clingo command-line tool on local machines. Use when requests mention \"clingo\" or require workflows supported by this tool."
---

# clingo

Use this skill to execute **clingo** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2439 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://potassco.org/clingo/
- **License:** MIT
- **Catalog description:** ASP system to ground and solve logic programs
## Procedure
1. Confirm the tool is available.
   - `command -v clingo`
   - `clingo --version` (fallback: `clingo -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search clingo` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search clingo` then install the matching package.
   - Fedora/RHEL: `dnf search clingo` then install the matching package.
3. Inspect supported commands/options.
   - `clingo --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
