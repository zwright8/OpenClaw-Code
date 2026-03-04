---
name: jnv
description: "Run and troubleshoot the jnv command-line tool on local machines. Use when requests mention \"jnv\" or require workflows supported by this tool."
---

# jnv

Use this skill to execute **jnv** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2237 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/ynqa/jnv
- **License:** MIT
- **Catalog description:** Interactive JSON filter using jq
## Procedure
1. Confirm the tool is available.
   - `command -v jnv`
   - `jnv --version` (fallback: `jnv -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search jnv` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search jnv` then install the matching package.
   - Fedora/RHEL: `dnf search jnv` then install the matching package.
3. Inspect supported commands/options.
   - `jnv --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
