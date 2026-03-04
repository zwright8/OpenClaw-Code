---
name: mdless
description: "Run and troubleshoot the mdless command-line tool on local machines. Use when requests mention \"mdless\" or require workflows supported by this tool."
---

# mdless

Use this skill to execute **mdless** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2010 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/ttscoff/mdless
- **License:** MIT
- **Catalog description:** Provides a formatted and highlighted view of Markdown files in Terminal
## Procedure
1. Confirm the tool is available.
   - `command -v mdless`
   - `mdless --version` (fallback: `mdless -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mdless` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mdless` then install the matching package.
   - Fedora/RHEL: `dnf search mdless` then install the matching package.
3. Inspect supported commands/options.
   - `mdless --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
