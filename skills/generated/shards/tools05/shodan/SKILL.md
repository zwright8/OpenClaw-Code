---
name: shodan
description: "Run and troubleshoot the shodan command-line tool on local machines. Use when requests mention \"shodan\" or require workflows supported by this tool."
---

# shodan

Use this skill to execute **shodan** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2148 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://cli.shodan.io
- **License:** MIT
- **Catalog description:** Python library and command-line utility for Shodan
## Procedure
1. Confirm the tool is available.
   - `command -v shodan`
   - `shodan --version` (fallback: `shodan -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search shodan` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search shodan` then install the matching package.
   - Fedora/RHEL: `dnf search shodan` then install the matching package.
3. Inspect supported commands/options.
   - `shodan --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
