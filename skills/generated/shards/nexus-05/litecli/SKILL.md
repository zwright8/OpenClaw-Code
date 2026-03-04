---
name: litecli
description: "Run and troubleshoot the litecli command-line tool on local machines. Use when requests mention \"litecli\" or require workflows supported by this tool."
---

# litecli

Use this skill to execute **litecli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2198 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/dbcli/litecli
- **License:** BSD-3-Clause
- **Catalog description:** CLI for SQLite Databases with auto-completion and syntax highlighting
## Procedure
1. Confirm the tool is available.
   - `command -v litecli`
   - `litecli --version` (fallback: `litecli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search litecli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search litecli` then install the matching package.
   - Fedora/RHEL: `dnf search litecli` then install the matching package.
3. Inspect supported commands/options.
   - `litecli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
