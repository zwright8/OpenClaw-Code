---
name: tpm
description: "Run and troubleshoot the tpm command-line tool on local machines. Use when requests mention \"tpm\" or require workflows supported by this tool."
---

# tpm

Use this skill to execute **tpm** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2486 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/tmux-plugins/tpm
- **License:** MIT
- **Catalog description:** Plugin manager for tmux
## Procedure
1. Confirm the tool is available.
   - `command -v tpm`
   - `tpm --version` (fallback: `tpm -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search tpm` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search tpm` then install the matching package.
   - Fedora/RHEL: `dnf search tpm` then install the matching package.
3. Inspect supported commands/options.
   - `tpm --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
