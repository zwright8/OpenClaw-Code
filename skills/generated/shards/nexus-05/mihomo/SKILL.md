---
name: mihomo
description: "Run and troubleshoot the mihomo command-line tool on local machines. Use when requests mention \"mihomo\" or require workflows supported by this tool."
---

# mihomo

Use this skill to execute **mihomo** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2048 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://wiki.metacubex.one
- **License:** GPL-3.0-or-later
- **Catalog description:** Another rule-based tunnel in Go, formerly known as ClashMeta
## Procedure
1. Confirm the tool is available.
   - `command -v mihomo`
   - `mihomo --version` (fallback: `mihomo -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mihomo` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mihomo` then install the matching package.
   - Fedora/RHEL: `dnf search mihomo` then install the matching package.
3. Inspect supported commands/options.
   - `mihomo --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
