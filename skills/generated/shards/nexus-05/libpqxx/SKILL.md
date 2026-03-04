---
name: libpqxx
description: "Run and troubleshoot the libpqxx command-line tool on local machines. Use when requests mention \"libpqxx\" or require workflows supported by this tool."
---

# libpqxx

Use this skill to execute **libpqxx** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2226 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://pqxx.org/development/libpqxx/
- **License:** BSD-3-Clause
- **Catalog description:** C++ connector for PostgreSQL
## Procedure
1. Confirm the tool is available.
   - `command -v libpqxx`
   - `libpqxx --version` (fallback: `libpqxx -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libpqxx` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libpqxx` then install the matching package.
   - Fedora/RHEL: `dnf search libpqxx` then install the matching package.
3. Inspect supported commands/options.
   - `libpqxx --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
