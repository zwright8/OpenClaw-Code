---
name: fprettify
description: "Run and troubleshoot the fprettify command-line tool on local machines. Use when requests mention \"fprettify\" or require workflows supported by this tool."
---

# fprettify

Use this skill to execute **fprettify** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2392 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/fortran-lang/fprettify/
- **License:** GPL-3.0-or-later
- **Catalog description:** Auto-formatter for modern fortran source code
## Procedure
1. Confirm the tool is available.
   - `command -v fprettify`
   - `fprettify --version` (fallback: `fprettify -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search fprettify` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search fprettify` then install the matching package.
   - Fedora/RHEL: `dnf search fprettify` then install the matching package.
3. Inspect supported commands/options.
   - `fprettify --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
