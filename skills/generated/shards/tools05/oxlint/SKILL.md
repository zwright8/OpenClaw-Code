---
name: oxlint
description: "Run and troubleshoot the oxlint command-line tool on local machines. Use when requests mention \"oxlint\" or require workflows supported by this tool."
---

# oxlint

Use this skill to execute **oxlint** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2280 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://oxc.rs/
- **License:** MIT
- **Catalog description:** High-performance linter for JavaScript and TypeScript written in Rust
## Procedure
1. Confirm the tool is available.
   - `command -v oxlint`
   - `oxlint --version` (fallback: `oxlint -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search oxlint` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search oxlint` then install the matching package.
   - Fedora/RHEL: `dnf search oxlint` then install the matching package.
3. Inspect supported commands/options.
   - `oxlint --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
