---
name: xerces-c
description: "Run and troubleshoot the xerces-c command-line tool on local machines. Use when requests mention \"xerces-c\" or require workflows supported by this tool."
---

# xerces-c

Use this skill to execute **xerces-c** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2192 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://xerces.apache.org/xerces-c/
- **License:** Apache-2.0
- **Catalog description:** Validating XML parser
## Procedure
1. Confirm the tool is available.
   - `command -v xerces-c`
   - `xerces-c --version` (fallback: `xerces-c -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search xerces-c` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search xerces-c` then install the matching package.
   - Fedora/RHEL: `dnf search xerces-c` then install the matching package.
3. Inspect supported commands/options.
   - `xerces-c --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
