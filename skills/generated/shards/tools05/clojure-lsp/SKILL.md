---
name: clojure-lsp
description: "Run and troubleshoot the clojure-lsp command-line tool on local machines. Use when requests mention \"clojure-lsp\" or require workflows supported by this tool."
---

# clojure-lsp

Use this skill to execute **clojure-lsp** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2360 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/clojure-lsp/clojure-lsp
- **License:** MIT
- **Catalog description:** Language Server (LSP) for Clojure
## Procedure
1. Confirm the tool is available.
   - `command -v clojure-lsp`
   - `clojure-lsp --version` (fallback: `clojure-lsp -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search clojure-lsp` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search clojure-lsp` then install the matching package.
   - Fedora/RHEL: `dnf search clojure-lsp` then install the matching package.
3. Inspect supported commands/options.
   - `clojure-lsp --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
