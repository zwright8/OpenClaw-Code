---
name: numbat
description: "Run and troubleshoot the numbat command-line tool on local machines. Use when requests mention \"numbat\" or require workflows supported by this tool."
---

# numbat

Use this skill to execute **numbat** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2346 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://numbat.dev/
- **License:** Apache-2.0 OR MIT
- **Catalog description:** Statically typed programming language for scientific computations
## Procedure
1. Confirm the tool is available.
   - `command -v numbat`
   - `numbat --version` (fallback: `numbat -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search numbat` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search numbat` then install the matching package.
   - Fedora/RHEL: `dnf search numbat` then install the matching package.
3. Inspect supported commands/options.
   - `numbat --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
