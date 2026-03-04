---
name: ruby-lsp
description: "Run and troubleshoot the ruby-lsp command-line tool on local machines. Use when requests mention \"ruby-lsp\" or require workflows supported by this tool."
---

# ruby-lsp

Use this skill to execute **ruby-lsp** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2294 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://shopify.github.io/ruby-lsp
- **License:** MIT
- **Catalog description:** Opinionated language server for Ruby
## Procedure
1. Confirm the tool is available.
   - `command -v ruby-lsp`
   - `ruby-lsp --version` (fallback: `ruby-lsp -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ruby-lsp` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ruby-lsp` then install the matching package.
   - Fedora/RHEL: `dnf search ruby-lsp` then install the matching package.
3. Inspect supported commands/options.
   - `ruby-lsp --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
