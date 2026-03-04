---
name: rollup
description: "Run and troubleshoot the rollup command-line tool on local machines. Use when requests mention \"rollup\" or require workflows supported by this tool."
---

# rollup

Use this skill to execute **rollup** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2253 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://rollupjs.org/
- **License:** ISC AND MIT
- **Catalog description:** Next-generation ES module bundler
## Procedure
1. Confirm the tool is available.
   - `command -v rollup`
   - `rollup --version` (fallback: `rollup -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search rollup` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search rollup` then install the matching package.
   - Fedora/RHEL: `dnf search rollup` then install the matching package.
3. Inspect supported commands/options.
   - `rollup --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
