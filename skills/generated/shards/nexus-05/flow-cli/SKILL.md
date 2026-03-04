---
name: flow-cli
description: "Run and troubleshoot the flow-cli command-line tool on local machines. Use when requests mention \"flow-cli\" or require workflows supported by this tool."
---

# flow-cli

Use this skill to execute **flow-cli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2417 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://onflow.org
- **License:** Apache-2.0
- **Catalog description:** Command-line interface that provides utilities for building Flow applications
## Procedure
1. Confirm the tool is available.
   - `command -v flow-cli`
   - `flow-cli --version` (fallback: `flow-cli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search flow-cli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search flow-cli` then install the matching package.
   - Fedora/RHEL: `dnf search flow-cli` then install the matching package.
3. Inspect supported commands/options.
   - `flow-cli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
