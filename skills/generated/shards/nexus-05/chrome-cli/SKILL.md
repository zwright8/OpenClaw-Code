---
name: chrome-cli
description: "Run and troubleshoot the chrome-cli command-line tool on local machines. Use when requests mention \"chrome-cli\" or require workflows supported by this tool."
---

# chrome-cli

Use this skill to execute **chrome-cli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2271 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/prasmussen/chrome-cli
- **License:** MIT
- **Catalog description:** Control Google Chrome from the command-line
## Procedure
1. Confirm the tool is available.
   - `command -v chrome-cli`
   - `chrome-cli --version` (fallback: `chrome-cli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search chrome-cli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search chrome-cli` then install the matching package.
   - Fedora/RHEL: `dnf search chrome-cli` then install the matching package.
3. Inspect supported commands/options.
   - `chrome-cli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
