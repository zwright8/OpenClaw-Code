---
name: adr-tools
description: "Run and troubleshoot the adr-tools command-line tool on local machines. Use when requests mention \"adr-tools\" or require workflows supported by this tool."
---

# adr-tools

Use this skill to execute **adr-tools** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2357 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/npryce/adr-tools
- **License:** CC-BY-4.0
- **Catalog description:** CLI tool for working with Architecture Decision Records
## Procedure
1. Confirm the tool is available.
   - `command -v adr-tools`
   - `adr-tools --version` (fallback: `adr-tools -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search adr-tools` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search adr-tools` then install the matching package.
   - Fedora/RHEL: `dnf search adr-tools` then install the matching package.
3. Inspect supported commands/options.
   - `adr-tools --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
