---
name: rdkit
description: "Run and troubleshoot the rdkit command-line tool on local machines. Use when requests mention \"rdkit\" or require workflows supported by this tool."
---

# rdkit

Use this skill to execute **rdkit** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2274 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://rdkit.org/
- **License:** BSD-3-Clause
- **Catalog description:** Open-source chemoinformatics library
## Procedure
1. Confirm the tool is available.
   - `command -v rdkit`
   - `rdkit --version` (fallback: `rdkit -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search rdkit` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search rdkit` then install the matching package.
   - Fedora/RHEL: `dnf search rdkit` then install the matching package.
3. Inspect supported commands/options.
   - `rdkit --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
