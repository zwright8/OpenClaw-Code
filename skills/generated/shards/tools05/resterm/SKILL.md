---
name: resterm
description: "Run and troubleshoot the resterm command-line tool on local machines. Use when requests mention \"resterm\" or require workflows supported by this tool."
---

# resterm

Use this skill to execute **resterm** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2164 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/unkn0wn-root/resterm
- **License:** Apache-2.0
- **Catalog description:** Terminal client for .http/.rest files with HTTP, GraphQL, and gRPC support
## Procedure
1. Confirm the tool is available.
   - `command -v resterm`
   - `resterm --version` (fallback: `resterm -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search resterm` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search resterm` then install the matching package.
   - Fedora/RHEL: `dnf search resterm` then install the matching package.
3. Inspect supported commands/options.
   - `resterm --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
