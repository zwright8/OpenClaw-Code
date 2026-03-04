---
name: structurizr-cli
description: "Run and troubleshoot the structurizr-cli command-line tool on local machines. Use when requests mention \"structurizr-cli\" or require workflows supported by this tool."
---

# structurizr-cli

Use this skill to execute **structurizr-cli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2317 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://docs.structurizr.com/cli
- **License:** Apache-2.0
- **Catalog description:** Command-line utility for Structurizr
## Procedure
1. Confirm the tool is available.
   - `command -v structurizr-cli`
   - `structurizr-cli --version` (fallback: `structurizr-cli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search structurizr-cli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search structurizr-cli` then install the matching package.
   - Fedora/RHEL: `dnf search structurizr-cli` then install the matching package.
3. Inspect supported commands/options.
   - `structurizr-cli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
