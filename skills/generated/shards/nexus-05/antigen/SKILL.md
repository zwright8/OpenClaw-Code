---
name: antigen
description: "Run and troubleshoot the antigen command-line tool on local machines. Use when requests mention \"antigen\" or require workflows supported by this tool."
---

# antigen

Use this skill to execute **antigen** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2214 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/zsh-users/antigen
- **License:** MIT
- **Catalog description:** Plugin manager for zsh, inspired by oh-my-zsh and vundle
## Procedure
1. Confirm the tool is available.
   - `command -v antigen`
   - `antigen --version` (fallback: `antigen -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search antigen` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search antigen` then install the matching package.
   - Fedora/RHEL: `dnf search antigen` then install the matching package.
3. Inspect supported commands/options.
   - `antigen --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
