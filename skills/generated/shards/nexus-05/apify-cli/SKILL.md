---
name: apify-cli
description: "Run and troubleshoot the apify-cli command-line tool on local machines. Use when requests mention \"apify-cli\" or require workflows supported by this tool."
---

# apify-cli

Use this skill to execute **apify-cli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2485 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://docs.apify.com/cli/
- **License:** Apache-2.0
- **Catalog description:** Apify command-line interface
## Procedure
1. Confirm the tool is available.
   - `command -v apify-cli`
   - `apify-cli --version` (fallback: `apify-cli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search apify-cli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search apify-cli` then install the matching package.
   - Fedora/RHEL: `dnf search apify-cli` then install the matching package.
3. Inspect supported commands/options.
   - `apify-cli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
