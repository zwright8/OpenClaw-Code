---
name: e2b
description: "Run and troubleshoot the e2b command-line tool on local machines. Use when requests mention \"e2b\" or require workflows supported by this tool."
---

# e2b

Use this skill to execute **e2b** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2412 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://e2b.dev
- **License:** Apache-2.0
- **Catalog description:** CLI to manage E2B sandboxes and templates
## Procedure
1. Confirm the tool is available.
   - `command -v e2b`
   - `e2b --version` (fallback: `e2b -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search e2b` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search e2b` then install the matching package.
   - Fedora/RHEL: `dnf search e2b` then install the matching package.
3. Inspect supported commands/options.
   - `e2b --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
