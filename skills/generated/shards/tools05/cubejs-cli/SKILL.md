---
name: cubejs-cli
description: "Run and troubleshoot the cubejs-cli command-line tool on local machines. Use when requests mention \"cubejs-cli\" or require workflows supported by this tool."
---

# cubejs-cli

Use this skill to execute **cubejs-cli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2402 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://cube.dev/
- **License:** Apache-2.0
- **Catalog description:** Cube.js command-line interface
## Procedure
1. Confirm the tool is available.
   - `command -v cubejs-cli`
   - `cubejs-cli --version` (fallback: `cubejs-cli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search cubejs-cli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search cubejs-cli` then install the matching package.
   - Fedora/RHEL: `dnf search cubejs-cli` then install the matching package.
3. Inspect supported commands/options.
   - `cubejs-cli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
