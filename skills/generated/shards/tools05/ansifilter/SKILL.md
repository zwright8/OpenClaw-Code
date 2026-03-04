---
name: ansifilter
description: "Run and troubleshoot the ansifilter command-line tool on local machines. Use when requests mention \"ansifilter\" or require workflows supported by this tool."
---

# ansifilter

Use this skill to execute **ansifilter** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2388 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** http://andre-simon.de/doku/ansifilter/en/ansifilter.php
- **License:** GPL-3.0-or-later
- **Catalog description:** Strip or convert ANSI codes into HTML, (La)Tex, RTF, or BBCode
## Procedure
1. Confirm the tool is available.
   - `command -v ansifilter`
   - `ansifilter --version` (fallback: `ansifilter -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ansifilter` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ansifilter` then install the matching package.
   - Fedora/RHEL: `dnf search ansifilter` then install the matching package.
3. Inspect supported commands/options.
   - `ansifilter --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
