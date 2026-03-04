---
name: gitmoji
description: "Run and troubleshoot the gitmoji command-line tool on local machines. Use when requests mention \"gitmoji\" or require workflows supported by this tool."
---

# gitmoji

Use this skill to execute **gitmoji** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2152 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gitmoji.dev
- **License:** MIT
- **Catalog description:** Interactive command-line tool for using emoji in commit messages
## Procedure
1. Confirm the tool is available.
   - `command -v gitmoji`
   - `gitmoji --version` (fallback: `gitmoji -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gitmoji` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gitmoji` then install the matching package.
   - Fedora/RHEL: `dnf search gitmoji` then install the matching package.
3. Inspect supported commands/options.
   - `gitmoji --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
