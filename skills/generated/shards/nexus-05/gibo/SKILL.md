---
name: gibo
description: "Run and troubleshoot the gibo command-line tool on local machines. Use when requests mention \"gibo\" or require workflows supported by this tool."
---

# gibo

Use this skill to execute **gibo** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2314 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/simonwhitaker/gibo
- **License:** Unlicense
- **Catalog description:** Access GitHub's .gitignore boilerplates
## Procedure
1. Confirm the tool is available.
   - `command -v gibo`
   - `gibo --version` (fallback: `gibo -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gibo` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gibo` then install the matching package.
   - Fedora/RHEL: `dnf search gibo` then install the matching package.
3. Inspect supported commands/options.
   - `gibo --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
