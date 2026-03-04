---
name: addlicense
description: "Run and troubleshoot the addlicense command-line tool on local machines. Use when requests mention \"addlicense\" or require workflows supported by this tool."
---

# addlicense

Use this skill to execute **addlicense** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2116 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/google/addlicense
- **License:** Apache-2.0
- **Catalog description:** Scan directories recursively to ensure source files have license headers
## Procedure
1. Confirm the tool is available.
   - `command -v addlicense`
   - `addlicense --version` (fallback: `addlicense -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search addlicense` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search addlicense` then install the matching package.
   - Fedora/RHEL: `dnf search addlicense` then install the matching package.
3. Inspect supported commands/options.
   - `addlicense --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
