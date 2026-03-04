---
name: foundry
description: "Run and troubleshoot the foundry command-line tool on local machines. Use when requests mention \"foundry\" or require workflows supported by this tool."
---

# foundry

Use this skill to execute **foundry** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2313 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/foundry-rs/foundry
- **License:** MIT OR Apache-2.0
- **Catalog description:** Blazing fast, portable and modular toolkit for Ethereum application development
## Procedure
1. Confirm the tool is available.
   - `command -v foundry`
   - `foundry --version` (fallback: `foundry -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search foundry` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search foundry` then install the matching package.
   - Fedora/RHEL: `dnf search foundry` then install the matching package.
3. Inspect supported commands/options.
   - `foundry --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
