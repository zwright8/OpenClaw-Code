---
name: butane
description: "Run and troubleshoot the butane command-line tool on local machines. Use when requests mention \"butane\" or require workflows supported by this tool."
---

# butane

Use this skill to execute **butane** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2091 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/coreos/butane
- **License:** Apache-2.0
- **Catalog description:** Translates human-readable Butane Configs into machine-readable Ignition Configs
## Procedure
1. Confirm the tool is available.
   - `command -v butane`
   - `butane --version` (fallback: `butane -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search butane` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search butane` then install the matching package.
   - Fedora/RHEL: `dnf search butane` then install the matching package.
3. Inspect supported commands/options.
   - `butane --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
