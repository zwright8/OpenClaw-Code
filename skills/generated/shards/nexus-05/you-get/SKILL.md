---
name: you-get
description: "Run and troubleshoot the you-get command-line tool on local machines. Use when requests mention \"you-get\" or require workflows supported by this tool."
---

# you-get

Use this skill to execute **you-get** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2260 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://you-get.org/
- **License:** MIT
- **Catalog description:** Dumb downloader that scrapes the web
## Procedure
1. Confirm the tool is available.
   - `command -v you-get`
   - `you-get --version` (fallback: `you-get -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search you-get` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search you-get` then install the matching package.
   - Fedora/RHEL: `dnf search you-get` then install the matching package.
3. Inspect supported commands/options.
   - `you-get --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
