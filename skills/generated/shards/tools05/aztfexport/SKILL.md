---
name: aztfexport
description: "Run and troubleshoot the aztfexport command-line tool on local machines. Use when requests mention \"aztfexport\" or require workflows supported by this tool."
---

# aztfexport

Use this skill to execute **aztfexport** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2176 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://azure.github.io/aztfexport/
- **License:** MPL-2.0
- **Catalog description:** Bring your existing Azure resources under the management of Terraform
## Procedure
1. Confirm the tool is available.
   - `command -v aztfexport`
   - `aztfexport --version` (fallback: `aztfexport -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search aztfexport` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search aztfexport` then install the matching package.
   - Fedora/RHEL: `dnf search aztfexport` then install the matching package.
3. Inspect supported commands/options.
   - `aztfexport --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
