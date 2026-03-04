---
name: tailwindcss-language-server
description: "Run and troubleshoot the tailwindcss-language-server command-line tool on local machines. Use when requests mention \"tailwindcss-language-server\" or require workflows supported by this tool."
---

# tailwindcss-language-server

Use this skill to execute **tailwindcss-language-server** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2329 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/tailwindlabs/tailwindcss-intellisense/tree/HEAD/packages/tailwindcss-language-server
- **License:** MIT
- **Catalog description:** LSP for TailwindCSS
## Procedure
1. Confirm the tool is available.
   - `command -v tailwindcss-language-server`
   - `tailwindcss-language-server --version` (fallback: `tailwindcss-language-server -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search tailwindcss-language-server` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search tailwindcss-language-server` then install the matching package.
   - Fedora/RHEL: `dnf search tailwindcss-language-server` then install the matching package.
3. Inspect supported commands/options.
   - `tailwindcss-language-server --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
