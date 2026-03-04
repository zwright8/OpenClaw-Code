---
name: kubectl-cnpg
description: "Run and troubleshoot the kubectl-cnpg command-line tool on local machines. Use when requests mention \"kubectl-cnpg\" or require workflows supported by this tool."
---

# kubectl-cnpg

Use this skill to execute **kubectl-cnpg** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2054 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://cloudnative-pg.io/
- **License:** Apache-2.0
- **Catalog description:** CloudNativePG plugin for kubectl
## Procedure
1. Confirm the tool is available.
   - `command -v kubectl-cnpg`
   - `kubectl-cnpg --version` (fallback: `kubectl-cnpg -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search kubectl-cnpg` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search kubectl-cnpg` then install the matching package.
   - Fedora/RHEL: `dnf search kubectl-cnpg` then install the matching package.
3. Inspect supported commands/options.
   - `kubectl-cnpg --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
