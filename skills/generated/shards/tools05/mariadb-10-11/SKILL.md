---
name: mariadb-10-11
description: "Run and troubleshoot the mariadb@10.11 command-line tool on local machines. Use when requests mention \"mariadb@10.11\" or require workflows supported by this tool."
---

# mariadb@10.11

Use this skill to execute **mariadb@10.11** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2228 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://mariadb.org/
- **License:** GPL-2.0-only
- **Catalog description:** Drop-in replacement for MySQL
- **Executable hint:** package/catalog name is `mariadb@10.11`, while the runnable binary is often `mariadb`.
## Procedure
1. Confirm the tool is available.
   - `command -v mariadb`
   - `mariadb --version` (fallback: `mariadb -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mariadb@10.11` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mariadb@10.11` then install the matching package.
   - Fedora/RHEL: `dnf search mariadb@10.11` then install the matching package.
3. Inspect supported commands/options.
   - `mariadb --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
