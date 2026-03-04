---
name: alembic
description: "Run and troubleshoot the alembic command-line tool on local machines. Use when requests mention \"alembic\" or require workflows supported by this tool."
---

# alembic

Use this skill to execute **alembic** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2403 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** http://www.alembic.io/
- **License:** BSD-3-Clause
- **Catalog description:** Open computer graphics interchange framework
## Procedure
1. Confirm the tool is available.
   - `command -v alembic`
   - `alembic --version` (fallback: `alembic -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search alembic` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search alembic` then install the matching package.
   - Fedora/RHEL: `dnf search alembic` then install the matching package.
3. Inspect supported commands/options.
   - `alembic --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
