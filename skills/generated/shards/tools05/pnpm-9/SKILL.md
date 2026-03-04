---
name: pnpm-9
description: "Run and troubleshoot the pnpm@9 command-line tool on local machines. Use when requests mention \"pnpm@9\" or require workflows supported by this tool."
---

# pnpm@9

Use this skill to execute **pnpm@9** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2293 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://pnpm.io/
- **License:** MIT
- **Catalog description:** Fast, disk space efficient package manager
- **Executable hint:** package/catalog name is `pnpm@9`, while the runnable binary is often `pnpm`.
## Procedure
1. Confirm the tool is available.
   - `command -v pnpm`
   - `pnpm --version` (fallback: `pnpm -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search pnpm@9` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search pnpm@9` then install the matching package.
   - Fedora/RHEL: `dnf search pnpm@9` then install the matching package.
3. Inspect supported commands/options.
   - `pnpm --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
