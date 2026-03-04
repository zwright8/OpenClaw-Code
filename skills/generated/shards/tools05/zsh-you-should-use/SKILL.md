---
name: zsh-you-should-use
description: "Run and troubleshoot the zsh-you-should-use command-line tool on local machines. Use when requests mention \"zsh-you-should-use\" or require workflows supported by this tool."
---

# zsh-you-should-use

Use this skill to execute **zsh-you-should-use** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2095 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/MichaelAquilina/zsh-you-should-use
- **License:** GPL-3.0-only
- **Catalog description:** ZSH plugin that reminds you to use existing aliases for commands you just typed
## Procedure
1. Confirm the tool is available.
   - `command -v zsh-you-should-use`
   - `zsh-you-should-use --version` (fallback: `zsh-you-should-use -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search zsh-you-should-use` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search zsh-you-should-use` then install the matching package.
   - Fedora/RHEL: `dnf search zsh-you-should-use` then install the matching package.
3. Inspect supported commands/options.
   - `zsh-you-should-use --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
