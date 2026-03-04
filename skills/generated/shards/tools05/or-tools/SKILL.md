---
name: or-tools
description: "Run and troubleshoot the or-tools command-line tool on local machines. Use when requests mention \"or-tools\" or require workflows supported by this tool."
---

# or-tools

Use this skill to execute **or-tools** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2058 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://developers.google.com/optimization/
- **License:** Apache-2.0
- **Catalog description:** Google's Operations Research tools
## Procedure
1. Confirm the tool is available.
   - `command -v or-tools`
   - `or-tools --version` (fallback: `or-tools -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search or-tools` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search or-tools` then install the matching package.
   - Fedora/RHEL: `dnf search or-tools` then install the matching package.
3. Inspect supported commands/options.
   - `or-tools --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
