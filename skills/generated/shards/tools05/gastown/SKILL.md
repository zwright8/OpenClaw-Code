---
name: gastown
description: "Run and troubleshoot the gastown command-line tool on local machines. Use when requests mention \"gastown\" or require workflows supported by this tool."
---

# gastown

Use this skill to execute **gastown** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2350 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/steveyegge/gastown
- **License:** MIT
- **Catalog description:** Multi-agent workspace manager
## Procedure
1. Confirm the tool is available.
   - `command -v gastown`
   - `gastown --version` (fallback: `gastown -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gastown` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gastown` then install the matching package.
   - Fedora/RHEL: `dnf search gastown` then install the matching package.
3. Inspect supported commands/options.
   - `gastown --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
