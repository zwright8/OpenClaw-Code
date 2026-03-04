---
name: aerc
description: "Run and troubleshoot the aerc command-line tool on local machines. Use when requests mention \"aerc\" or require workflows supported by this tool."
---

# aerc

Use this skill to execute **aerc** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2490 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://aerc-mail.org/
- **License:** MIT
- **Catalog description:** Email client that runs in your terminal
## Procedure
1. Confirm the tool is available.
   - `command -v aerc`
   - `aerc --version` (fallback: `aerc -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search aerc` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search aerc` then install the matching package.
   - Fedora/RHEL: `dnf search aerc` then install the matching package.
3. Inspect supported commands/options.
   - `aerc --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
