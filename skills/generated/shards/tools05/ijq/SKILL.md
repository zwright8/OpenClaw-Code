---
name: ijq
description: "Run and troubleshoot the ijq command-line tool on local machines. Use when requests mention \"ijq\" or require workflows supported by this tool."
---

# ijq

Use this skill to execute **ijq** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2221 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://codeberg.org/gpanders/ijq
- **License:** GPL-3.0-or-later
- **Catalog description:** Interactive jq
## Procedure
1. Confirm the tool is available.
   - `command -v ijq`
   - `ijq --version` (fallback: `ijq -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ijq` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ijq` then install the matching package.
   - Fedora/RHEL: `dnf search ijq` then install the matching package.
3. Inspect supported commands/options.
   - `ijq --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
