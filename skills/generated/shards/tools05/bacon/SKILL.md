---
name: bacon
description: "Run and troubleshoot the bacon command-line tool on local machines. Use when requests mention \"bacon\" or require workflows supported by this tool."
---

# bacon

Use this skill to execute **bacon** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2257 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://dystroy.org/bacon/
- **License:** AGPL-3.0-or-later
- **Catalog description:** Background rust code check
## Procedure
1. Confirm the tool is available.
   - `command -v bacon`
   - `bacon --version` (fallback: `bacon -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search bacon` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search bacon` then install the matching package.
   - Fedora/RHEL: `dnf search bacon` then install the matching package.
3. Inspect supported commands/options.
   - `bacon --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
