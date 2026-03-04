---
name: brew-cask-completion
description: "Run and troubleshoot the brew-cask-completion command-line tool on local machines. Use when requests mention \"brew-cask-completion\" or require workflows supported by this tool."
---

# brew-cask-completion

Use this skill to execute **brew-cask-completion** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2248 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/xyb/homebrew-cask-completion
- **License:** BSD-2-Clause
- **Catalog description:** Fish completion for brew-cask
## Procedure
1. Confirm the tool is available.
   - `command -v brew-cask-completion`
   - `brew-cask-completion --version` (fallback: `brew-cask-completion -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search brew-cask-completion` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search brew-cask-completion` then install the matching package.
   - Fedora/RHEL: `dnf search brew-cask-completion` then install the matching package.
3. Inspect supported commands/options.
   - `brew-cask-completion --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
