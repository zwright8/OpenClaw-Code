---
name: pieces-cli
description: "Run and troubleshoot the pieces-cli command-line tool on local machines. Use when requests mention \"pieces-cli\" or require workflows supported by this tool."
---

# pieces-cli

Use this skill to execute **pieces-cli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2446 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://docs.pieces.app/products/cli
- **License:** MIT
- **Catalog description:** Command-line tool for Pieces.app
## Procedure
1. Confirm the tool is available.
   - `command -v pieces-cli`
   - `pieces-cli --version` (fallback: `pieces-cli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search pieces-cli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search pieces-cli` then install the matching package.
   - Fedora/RHEL: `dnf search pieces-cli` then install the matching package.
3. Inspect supported commands/options.
   - `pieces-cli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
