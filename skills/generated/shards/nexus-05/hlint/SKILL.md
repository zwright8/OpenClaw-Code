---
name: hlint
description: "Run and troubleshoot the hlint command-line tool on local machines. Use when requests mention \"hlint\" or require workflows supported by this tool."
---

# hlint

Use this skill to execute **hlint** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2434 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/ndmitchell/hlint
- **License:** BSD-3-Clause
- **Catalog description:** Haskell source code suggestions
## Procedure
1. Confirm the tool is available.
   - `command -v hlint`
   - `hlint --version` (fallback: `hlint -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search hlint` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search hlint` then install the matching package.
   - Fedora/RHEL: `dnf search hlint` then install the matching package.
3. Inspect supported commands/options.
   - `hlint --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
