---
name: snitch
description: "Run and troubleshoot the snitch command-line tool on local machines. Use when requests mention \"snitch\" or require workflows supported by this tool."
---

# snitch

Use this skill to execute **snitch** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2462 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/karol-broda/snitch
- **License:** MIT
- **Catalog description:** Prettier way to inspect network connections
## Procedure
1. Confirm the tool is available.
   - `command -v snitch`
   - `snitch --version` (fallback: `snitch -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search snitch` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search snitch` then install the matching package.
   - Fedora/RHEL: `dnf search snitch` then install the matching package.
3. Inspect supported commands/options.
   - `snitch --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
