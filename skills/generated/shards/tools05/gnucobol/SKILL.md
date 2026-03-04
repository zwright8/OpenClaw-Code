---
name: gnucobol
description: "Run and troubleshoot the gnucobol command-line tool on local machines. Use when requests mention \"gnucobol\" or require workflows supported by this tool."
---

# gnucobol

Use this skill to execute **gnucobol** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2276 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gnucobol.sourceforge.io/
- **License:** GPL-3.0-or-later
- **Catalog description:** COBOL85-202x compiler supporting lots of dialect specific extensions
## Procedure
1. Confirm the tool is available.
   - `command -v gnucobol`
   - `gnucobol --version` (fallback: `gnucobol -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gnucobol` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gnucobol` then install the matching package.
   - Fedora/RHEL: `dnf search gnucobol` then install the matching package.
3. Inspect supported commands/options.
   - `gnucobol --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
