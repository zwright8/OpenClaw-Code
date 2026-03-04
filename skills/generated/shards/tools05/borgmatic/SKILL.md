---
name: borgmatic
description: "Run and troubleshoot the borgmatic command-line tool on local machines. Use when requests mention \"borgmatic\" or require workflows supported by this tool."
---

# borgmatic

Use this skill to execute **borgmatic** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2038 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://torsion.org/borgmatic/
- **License:** GPL-3.0-or-later
- **Catalog description:** Simple wrapper script for the Borg backup software
## Procedure
1. Confirm the tool is available.
   - `command -v borgmatic`
   - `borgmatic --version` (fallback: `borgmatic -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search borgmatic` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search borgmatic` then install the matching package.
   - Fedora/RHEL: `dnf search borgmatic` then install the matching package.
3. Inspect supported commands/options.
   - `borgmatic --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
