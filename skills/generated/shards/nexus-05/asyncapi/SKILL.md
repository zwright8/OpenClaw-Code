---
name: asyncapi
description: "Run and troubleshoot the asyncapi command-line tool on local machines. Use when requests mention \"asyncapi\" or require workflows supported by this tool."
---

# asyncapi

Use this skill to execute **asyncapi** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2042 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/asyncapi/cli
- **License:** Apache-2.0
- **Catalog description:** All in one CLI for all AsyncAPI tools
## Procedure
1. Confirm the tool is available.
   - `command -v asyncapi`
   - `asyncapi --version` (fallback: `asyncapi -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search asyncapi` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search asyncapi` then install the matching package.
   - Fedora/RHEL: `dnf search asyncapi` then install the matching package.
3. Inspect supported commands/options.
   - `asyncapi --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
