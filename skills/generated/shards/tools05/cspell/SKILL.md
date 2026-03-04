---
name: cspell
description: "Run and troubleshoot the cspell command-line tool on local machines. Use when requests mention \"cspell\" or require workflows supported by this tool."
---

# cspell

Use this skill to execute **cspell** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2321 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://cspell.org
- **License:** MIT
- **Catalog description:** Spell checker for code
## Procedure
1. Confirm the tool is available.
   - `command -v cspell`
   - `cspell --version` (fallback: `cspell -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search cspell` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search cspell` then install the matching package.
   - Fedora/RHEL: `dnf search cspell` then install the matching package.
3. Inspect supported commands/options.
   - `cspell --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
