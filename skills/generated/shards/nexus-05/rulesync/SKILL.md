---
name: rulesync
description: "Run and troubleshoot the rulesync command-line tool on local machines. Use when requests mention \"rulesync\" or require workflows supported by this tool."
---

# rulesync

Use this skill to execute **rulesync** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2011 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/dyoshikawa/rulesync
- **License:** MIT
- **Catalog description:** Unified AI rules management CLI tool
## Procedure
1. Confirm the tool is available.
   - `command -v rulesync`
   - `rulesync --version` (fallback: `rulesync -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search rulesync` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search rulesync` then install the matching package.
   - Fedora/RHEL: `dnf search rulesync` then install the matching package.
3. Inspect supported commands/options.
   - `rulesync --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
