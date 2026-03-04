---
name: slither-analyzer
description: "Run and troubleshoot the slither-analyzer command-line tool on local machines. Use when requests mention \"slither-analyzer\" or require workflows supported by this tool."
---

# slither-analyzer

Use this skill to execute **slither-analyzer** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2414 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/crytic/slither
- **License:** AGPL-3.0-only
- **Catalog description:** Solidity static analysis framework written in Python 3
## Procedure
1. Confirm the tool is available.
   - `command -v slither-analyzer`
   - `slither-analyzer --version` (fallback: `slither-analyzer -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search slither-analyzer` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search slither-analyzer` then install the matching package.
   - Fedora/RHEL: `dnf search slither-analyzer` then install the matching package.
3. Inspect supported commands/options.
   - `slither-analyzer --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
