---
name: luau
description: "Run and troubleshoot the luau command-line tool on local machines. Use when requests mention \"luau\" or require workflows supported by this tool."
---

# luau

Use this skill to execute **luau** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2114 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://luau.org
- **License:** MIT
- **Catalog description:** Fast, safe, gradually typed embeddable scripting language derived from Lua
## Procedure
1. Confirm the tool is available.
   - `command -v luau`
   - `luau --version` (fallback: `luau -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search luau` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search luau` then install the matching package.
   - Fedora/RHEL: `dnf search luau` then install the matching package.
3. Inspect supported commands/options.
   - `luau --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
