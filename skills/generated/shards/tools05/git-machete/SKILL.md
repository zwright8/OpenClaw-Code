---
name: git-machete
description: "Run and troubleshoot the git-machete command-line tool on local machines. Use when requests mention \"git-machete\" or require workflows supported by this tool."
---

# git-machete

Use this skill to execute **git-machete** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2367 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/VirtusLab/git-machete
- **License:** MIT
- **Catalog description:** Git repository organizer & rebase workflow automation tool
## Procedure
1. Confirm the tool is available.
   - `command -v git-machete`
   - `git-machete --version` (fallback: `git-machete -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search git-machete` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search git-machete` then install the matching package.
   - Fedora/RHEL: `dnf search git-machete` then install the matching package.
3. Inspect supported commands/options.
   - `git-machete --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
