---
name: autoenv
description: "Run and troubleshoot the autoenv command-line tool on local machines. Use when requests mention \"autoenv\" or require workflows supported by this tool."
---

# autoenv

Use this skill to execute **autoenv** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2162 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/hyperupcall/autoenv
- **License:** MIT
- **Catalog description:** Per-project, per-directory shell environments
## Procedure
1. Confirm the tool is available.
   - `command -v autoenv`
   - `autoenv --version` (fallback: `autoenv -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search autoenv` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search autoenv` then install the matching package.
   - Fedora/RHEL: `dnf search autoenv` then install the matching package.
3. Inspect supported commands/options.
   - `autoenv --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
