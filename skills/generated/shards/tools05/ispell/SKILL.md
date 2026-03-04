---
name: ispell
description: "Run and troubleshoot the ispell command-line tool on local machines. Use when requests mention \"ispell\" or require workflows supported by this tool."
---

# ispell

Use this skill to execute **ispell** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2355 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.cs.hmc.edu/~geoff/ispell.html
- **License:** LicenseRef-Homebrew-cannot-represent
- **Catalog description:** International Ispell
## Procedure
1. Confirm the tool is available.
   - `command -v ispell`
   - `ispell --version` (fallback: `ispell -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ispell` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ispell` then install the matching package.
   - Fedora/RHEL: `dnf search ispell` then install the matching package.
3. Inspect supported commands/options.
   - `ispell --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
