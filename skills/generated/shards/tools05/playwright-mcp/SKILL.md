---
name: playwright-mcp
description: "Run and troubleshoot the playwright-mcp command-line tool on local machines. Use when requests mention \"playwright-mcp\" or require workflows supported by this tool."
---

# playwright-mcp

Use this skill to execute **playwright-mcp** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2337 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/microsoft/playwright-mcp
- **License:** Apache-2.0
- **Catalog description:** MCP server for Playwright
## Procedure
1. Confirm the tool is available.
   - `command -v playwright-mcp`
   - `playwright-mcp --version` (fallback: `playwright-mcp -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search playwright-mcp` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search playwright-mcp` then install the matching package.
   - Fedora/RHEL: `dnf search playwright-mcp` then install the matching package.
3. Inspect supported commands/options.
   - `playwright-mcp --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
