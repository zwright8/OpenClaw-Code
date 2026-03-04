---
name: pdfcrack
description: "Run and troubleshoot the pdfcrack command-line tool on local machines. Use when requests mention \"pdfcrack\" or require workflows supported by this tool."
---

# pdfcrack

Use this skill to execute **pdfcrack** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2144 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://pdfcrack.sourceforge.net/
- **License:** GPL-2.0-or-later
- **Catalog description:** PDF files password cracker
## Procedure
1. Confirm the tool is available.
   - `command -v pdfcrack`
   - `pdfcrack --version` (fallback: `pdfcrack -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search pdfcrack` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search pdfcrack` then install the matching package.
   - Fedora/RHEL: `dnf search pdfcrack` then install the matching package.
3. Inspect supported commands/options.
   - `pdfcrack --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
