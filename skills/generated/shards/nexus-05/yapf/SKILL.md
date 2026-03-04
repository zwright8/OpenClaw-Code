---
name: yapf
description: "Run and troubleshoot the yapf command-line tool on local machines. Use when requests mention \"yapf\" or require workflows supported by this tool."
---

# yapf

Use this skill to execute **yapf** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2168 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/google/yapf
- **License:** Apache-2.0
- **Catalog description:** Formatter for python code
## Procedure
1. Confirm the tool is available.
   - `command -v yapf`
   - `yapf --version` (fallback: `yapf -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search yapf` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search yapf` then install the matching package.
   - Fedora/RHEL: `dnf search yapf` then install the matching package.
3. Inspect supported commands/options.
   - `yapf --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
