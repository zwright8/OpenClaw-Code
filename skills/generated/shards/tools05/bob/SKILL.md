---
name: bob
description: "Run and troubleshoot the bob command-line tool on local machines. Use when requests mention \"bob\" or require workflows supported by this tool."
---

# bob

Use this skill to execute **bob** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2083 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/MordechaiHadad/bob
- **License:** MIT
- **Catalog description:** Version manager for neovim
## Procedure
1. Confirm the tool is available.
   - `command -v bob`
   - `bob --version` (fallback: `bob -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search bob` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search bob` then install the matching package.
   - Fedora/RHEL: `dnf search bob` then install the matching package.
3. Inspect supported commands/options.
   - `bob --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
