---
name: agent-browser
description: "Run and troubleshoot the agent-browser command-line tool on local machines. Use when requests mention \"agent-browser\" or require workflows supported by this tool."
---

# agent-browser

Use this skill to execute **agent-browser** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2087 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://agent-browser.dev/
- **License:** Apache-2.0
- **Catalog description:** Browser automation CLI for AI agents
## Procedure
1. Confirm the tool is available.
   - `command -v agent-browser`
   - `agent-browser --version` (fallback: `agent-browser -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search agent-browser` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search agent-browser` then install the matching package.
   - Fedora/RHEL: `dnf search agent-browser` then install the matching package.
3. Inspect supported commands/options.
   - `agent-browser --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
