---
name: rosa-cli
description: "Run and troubleshoot the rosa-cli command-line tool on local machines. Use when requests mention \"rosa-cli\" or require workflows supported by this tool."
---

# rosa-cli

Use this skill to execute **rosa-cli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2493 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.openshift.com/products/amazon-openshift
- **License:** Apache-2.0
- **Catalog description:** RedHat OpenShift Service on AWS (ROSA) command-line interface
## Procedure
1. Confirm the tool is available.
   - `command -v rosa-cli`
   - `rosa-cli --version` (fallback: `rosa-cli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search rosa-cli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search rosa-cli` then install the matching package.
   - Fedora/RHEL: `dnf search rosa-cli` then install the matching package.
3. Inspect supported commands/options.
   - `rosa-cli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
