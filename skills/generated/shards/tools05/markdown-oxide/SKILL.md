---
name: markdown-oxide
description: "Run and troubleshoot the markdown-oxide command-line tool on local machines. Use when requests mention \"markdown-oxide\" or require workflows supported by this tool."
---

# markdown-oxide

Use this skill to execute **markdown-oxide** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2497 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://oxide.md
- **License:** Apache-2.0
- **Catalog description:** Personal Knowledge Management System for the LSP
## Procedure
1. Confirm the tool is available.
   - `command -v markdown-oxide`
   - `markdown-oxide --version` (fallback: `markdown-oxide -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search markdown-oxide` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search markdown-oxide` then install the matching package.
   - Fedora/RHEL: `dnf search markdown-oxide` then install the matching package.
3. Inspect supported commands/options.
   - `markdown-oxide --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
