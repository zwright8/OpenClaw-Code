---
name: homeassistant-cli
description: "Run and troubleshoot the homeassistant-cli command-line tool on local machines. Use when requests mention \"homeassistant-cli\" or require workflows supported by this tool."
---

# homeassistant-cli

Use this skill to execute **homeassistant-cli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2436 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/home-assistant-ecosystem/home-assistant-cli
- **License:** Apache-2.0
- **Catalog description:** Command-line utility for Home Assistant
## Procedure
1. Confirm the tool is available.
   - `command -v homeassistant-cli`
   - `homeassistant-cli --version` (fallback: `homeassistant-cli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search homeassistant-cli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search homeassistant-cli` then install the matching package.
   - Fedora/RHEL: `dnf search homeassistant-cli` then install the matching package.
3. Inspect supported commands/options.
   - `homeassistant-cli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
