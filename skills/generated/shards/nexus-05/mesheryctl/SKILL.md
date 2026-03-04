---
name: mesheryctl
description: "Run and troubleshoot the mesheryctl command-line tool on local machines. Use when requests mention \"mesheryctl\" or require workflows supported by this tool."
---

# mesheryctl

Use this skill to execute **mesheryctl** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2052 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://meshery.io
- **License:** Apache-2.0
- **Catalog description:** Command-line utility for Meshery, the cloud native management plane
## Procedure
1. Confirm the tool is available.
   - `command -v mesheryctl`
   - `mesheryctl --version` (fallback: `mesheryctl -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mesheryctl` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mesheryctl` then install the matching package.
   - Fedora/RHEL: `dnf search mesheryctl` then install the matching package.
3. Inspect supported commands/options.
   - `mesheryctl --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
