---
name: coturn
description: "Run and troubleshoot the coturn command-line tool on local machines. Use when requests mention \"coturn\" or require workflows supported by this tool."
---

# coturn

Use this skill to execute **coturn** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2468 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/coturn/coturn
- **License:** BSD-3-Clause
- **Catalog description:** Free open source implementation of TURN and STUN Server
## Procedure
1. Confirm the tool is available.
   - `command -v coturn`
   - `coturn --version` (fallback: `coturn -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search coturn` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search coturn` then install the matching package.
   - Fedora/RHEL: `dnf search coturn` then install the matching package.
3. Inspect supported commands/options.
   - `coturn --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
