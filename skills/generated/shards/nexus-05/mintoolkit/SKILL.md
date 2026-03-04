---
name: mintoolkit
description: "Run and troubleshoot the mintoolkit command-line tool on local machines. Use when requests mention \"mintoolkit\" or require workflows supported by this tool."
---

# mintoolkit

Use this skill to execute **mintoolkit** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2129 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://slimtoolkit.org/
- **License:** Apache-2.0
- **Catalog description:** Minify and secure Docker images
## Procedure
1. Confirm the tool is available.
   - `command -v mintoolkit`
   - `mintoolkit --version` (fallback: `mintoolkit -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mintoolkit` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mintoolkit` then install the matching package.
   - Fedora/RHEL: `dnf search mintoolkit` then install the matching package.
3. Inspect supported commands/options.
   - `mintoolkit --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
