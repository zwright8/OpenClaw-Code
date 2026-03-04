---
name: whistle
description: "Run and troubleshoot the whistle command-line tool on local machines. Use when requests mention \"whistle\" or require workflows supported by this tool."
---

# whistle

Use this skill to execute **whistle** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2143 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/avwo/whistle
- **License:** MIT
- **Catalog description:** HTTP, HTTP2, HTTPS, Websocket debugging proxy
## Procedure
1. Confirm the tool is available.
   - `command -v whistle`
   - `whistle --version` (fallback: `whistle -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search whistle` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search whistle` then install the matching package.
   - Fedora/RHEL: `dnf search whistle` then install the matching package.
3. Inspect supported commands/options.
   - `whistle --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
