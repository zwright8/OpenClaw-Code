---
name: checkdmarc
description: "Run and troubleshoot the checkdmarc command-line tool on local machines. Use when requests mention \"checkdmarc\" or require workflows supported by this tool."
---

# checkdmarc

Use this skill to execute **checkdmarc** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2437 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://domainaware.github.io/checkdmarc/
- **License:** Apache-2.0
- **Catalog description:** Command-line parser for SPF and DMARC DNS records
## Procedure
1. Confirm the tool is available.
   - `command -v checkdmarc`
   - `checkdmarc --version` (fallback: `checkdmarc -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search checkdmarc` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search checkdmarc` then install the matching package.
   - Fedora/RHEL: `dnf search checkdmarc` then install the matching package.
3. Inspect supported commands/options.
   - `checkdmarc --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
