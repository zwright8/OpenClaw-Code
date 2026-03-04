---
name: pstoedit
description: "Run and troubleshoot the pstoedit command-line tool on local machines. Use when requests mention \"pstoedit\" or require workflows supported by this tool."
---

# pstoedit

Use this skill to execute **pstoedit** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2034 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** http://www.pstoedit.net/
- **License:** GPL-2.0-or-later
- **Catalog description:** Convert PostScript and PDF files to editable vector graphics
## Procedure
1. Confirm the tool is available.
   - `command -v pstoedit`
   - `pstoedit --version` (fallback: `pstoedit -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search pstoedit` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search pstoedit` then install the matching package.
   - Fedora/RHEL: `dnf search pstoedit` then install the matching package.
3. Inspect supported commands/options.
   - `pstoedit --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
