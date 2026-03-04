---
name: n8n-mcp
description: "Run and troubleshoot the n8n-mcp command-line tool on local machines. Use when requests mention \"n8n-mcp\" or require workflows supported by this tool."
---

# n8n-mcp

Use this skill to execute **n8n-mcp** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2055 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.n8n-mcp.com/
- **License:** MIT
- **Catalog description:** MCP for Claude Desktop, Claude Code, Windsurf, Cursor to build n8n workflows
## Procedure
1. Confirm the tool is available.
   - `command -v n8n-mcp`
   - `n8n-mcp --version` (fallback: `n8n-mcp -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search n8n-mcp` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search n8n-mcp` then install the matching package.
   - Fedora/RHEL: `dnf search n8n-mcp` then install the matching package.
3. Inspect supported commands/options.
   - `n8n-mcp --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
