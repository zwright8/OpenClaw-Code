---
name: haskell-language-server
description: "Run and troubleshoot the haskell-language-server command-line tool on local machines. Use when requests mention \"haskell-language-server\" or require workflows supported by this tool."
---

# haskell-language-server

Use this skill to execute **haskell-language-server** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2101 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/haskell/haskell-language-server
- **License:** Apache-2.0
- **Catalog description:** Integration point for ghcide and haskell-ide-engine. One IDE to rule them all
## Procedure
1. Confirm the tool is available.
   - `command -v haskell-language-server`
   - `haskell-language-server --version` (fallback: `haskell-language-server -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search haskell-language-server` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search haskell-language-server` then install the matching package.
   - Fedora/RHEL: `dnf search haskell-language-server` then install the matching package.
3. Inspect supported commands/options.
   - `haskell-language-server --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
