---
name: forgit
description: "Run and troubleshoot the forgit command-line tool on local machines. Use when requests mention \"forgit\" or require workflows supported by this tool."
---

# forgit

Use this skill to execute **forgit** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2315 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/wfxr/forgit
- **License:** MIT
- **Catalog description:** Interactive git commands in the terminal
## Procedure
1. Confirm the tool is available.
   - `command -v forgit`
   - `forgit --version` (fallback: `forgit -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search forgit` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search forgit` then install the matching package.
   - Fedora/RHEL: `dnf search forgit` then install the matching package.
3. Inspect supported commands/options.
   - `forgit --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
