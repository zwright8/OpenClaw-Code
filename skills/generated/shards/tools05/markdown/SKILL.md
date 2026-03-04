---
name: markdown
description: "Run and troubleshoot the markdown command-line tool on local machines. Use when requests mention \"markdown\" or require workflows supported by this tool."
---

# markdown

Use this skill to execute **markdown** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2203 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://daringfireball.net/projects/markdown/
- **License:** BSD-3-Clause
- **Catalog description:** Text-to-HTML conversion tool
## Procedure
1. Confirm the tool is available.
   - `command -v markdown`
   - `markdown --version` (fallback: `markdown -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search markdown` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search markdown` then install the matching package.
   - Fedora/RHEL: `dnf search markdown` then install the matching package.
3. Inspect supported commands/options.
   - `markdown --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
