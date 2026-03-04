---
name: mcp-inspector
description: "Run and troubleshoot the mcp-inspector command-line tool on local machines. Use when requests mention \"mcp-inspector\" or require workflows supported by this tool."
---

# mcp-inspector

Use this skill to execute **mcp-inspector** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2256 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://modelcontextprotocol.io/docs/tools/inspector
- **License:** MIT
- **Catalog description:** Visual testing tool for MCP servers
## Procedure
1. Confirm the tool is available.
   - `command -v mcp-inspector`
   - `mcp-inspector --version` (fallback: `mcp-inspector -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mcp-inspector` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mcp-inspector` then install the matching package.
   - Fedora/RHEL: `dnf search mcp-inspector` then install the matching package.
3. Inspect supported commands/options.
   - `mcp-inspector --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
