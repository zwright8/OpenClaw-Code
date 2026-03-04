---
name: bashate
description: "Run and troubleshoot the bashate command-line tool on local machines. Use when requests mention \"bashate\" or require workflows supported by this tool."
---

# bashate

Use this skill to execute **bashate** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2404 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/openstack/bashate
- **License:** Apache-2.0
- **Catalog description:** Code style enforcement for bash programs
## Procedure
1. Confirm the tool is available.
   - `command -v bashate`
   - `bashate --version` (fallback: `bashate -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search bashate` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search bashate` then install the matching package.
   - Fedora/RHEL: `dnf search bashate` then install the matching package.
3. Inspect supported commands/options.
   - `bashate --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
