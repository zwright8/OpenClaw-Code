---
name: vault-cli
description: "Run and troubleshoot the vault-cli command-line tool on local machines. Use when requests mention \"vault-cli\" or require workflows supported by this tool."
---

# vault-cli

Use this skill to execute **vault-cli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2031 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://jackrabbit.apache.org/filevault/index.html
- **License:** Apache-2.0
- **Catalog description:** Subversion-like utility to work with Jackrabbit FileVault
## Procedure
1. Confirm the tool is available.
   - `command -v vault-cli`
   - `vault-cli --version` (fallback: `vault-cli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search vault-cli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search vault-cli` then install the matching package.
   - Fedora/RHEL: `dnf search vault-cli` then install the matching package.
3. Inspect supported commands/options.
   - `vault-cli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
