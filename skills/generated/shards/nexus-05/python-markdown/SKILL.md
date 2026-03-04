---
name: python-markdown
description: "Run and troubleshoot the python-markdown command-line tool on local machines. Use when requests mention \"python-markdown\" or require workflows supported by this tool."
---

# python-markdown

Use this skill to execute **python-markdown** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2062 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://python-markdown.github.io
- **License:** BSD-3-Clause
- **Catalog description:** Python implementation of Markdown
## Procedure
1. Confirm the tool is available.
   - `command -v python-markdown`
   - `python-markdown --version` (fallback: `python-markdown -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search python-markdown` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search python-markdown` then install the matching package.
   - Fedora/RHEL: `dnf search python-markdown` then install the matching package.
3. Inspect supported commands/options.
   - `python-markdown --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
