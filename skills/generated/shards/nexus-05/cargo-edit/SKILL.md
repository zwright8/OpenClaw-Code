---
name: cargo-edit
description: "Run and troubleshoot the cargo-edit command-line tool on local machines. Use when requests mention \"cargo-edit\" or require workflows supported by this tool."
---

# cargo-edit

Use this skill to execute **cargo-edit** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2491 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://killercup.github.io/cargo-edit/
- **License:** MIT
- **Catalog description:** Utility for managing cargo dependencies from the command-line
## Procedure
1. Confirm the tool is available.
   - `command -v cargo-edit`
   - `cargo-edit --version` (fallback: `cargo-edit -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search cargo-edit` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search cargo-edit` then install the matching package.
   - Fedora/RHEL: `dnf search cargo-edit` then install the matching package.
3. Inspect supported commands/options.
   - `cargo-edit --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
