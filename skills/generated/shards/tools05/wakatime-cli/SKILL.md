---
name: wakatime-cli
description: "Run and troubleshoot the wakatime-cli command-line tool on local machines. Use when requests mention \"wakatime-cli\" or require workflows supported by this tool."
---

# wakatime-cli

Use this skill to execute **wakatime-cli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2222 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://wakatime.com/
- **License:** BSD-3-Clause
- **Catalog description:** Command-line interface to the WakaTime api
## Procedure
1. Confirm the tool is available.
   - `command -v wakatime-cli`
   - `wakatime-cli --version` (fallback: `wakatime-cli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search wakatime-cli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search wakatime-cli` then install the matching package.
   - Fedora/RHEL: `dnf search wakatime-cli` then install the matching package.
3. Inspect supported commands/options.
   - `wakatime-cli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
