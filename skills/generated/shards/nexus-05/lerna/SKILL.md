---
name: lerna
description: "Run and troubleshoot the lerna command-line tool on local machines. Use when requests mention \"lerna\" or require workflows supported by this tool."
---

# lerna

Use this skill to execute **lerna** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2297 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://lerna.js.org
- **License:** MIT
- **Catalog description:** Tool for managing JavaScript projects with multiple packages
## Procedure
1. Confirm the tool is available.
   - `command -v lerna`
   - `lerna --version` (fallback: `lerna -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search lerna` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search lerna` then install the matching package.
   - Fedora/RHEL: `dnf search lerna` then install the matching package.
3. Inspect supported commands/options.
   - `lerna --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
