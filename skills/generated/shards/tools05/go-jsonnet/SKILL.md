---
name: go-jsonnet
description: "Run and troubleshoot the go-jsonnet command-line tool on local machines. Use when requests mention \"go-jsonnet\" or require workflows supported by this tool."
---

# go-jsonnet

Use this skill to execute **go-jsonnet** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2153 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://jsonnet.org/
- **License:** Apache-2.0
- **Catalog description:** Go implementation of configuration language for defining JSON data
## Procedure
1. Confirm the tool is available.
   - `command -v go-jsonnet`
   - `go-jsonnet --version` (fallback: `go-jsonnet -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search go-jsonnet` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search go-jsonnet` then install the matching package.
   - Fedora/RHEL: `dnf search go-jsonnet` then install the matching package.
3. Inspect supported commands/options.
   - `go-jsonnet --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
