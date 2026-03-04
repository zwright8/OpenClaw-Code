---
name: macchina
description: "Run and troubleshoot the macchina command-line tool on local machines. Use when requests mention \"macchina\" or require workflows supported by this tool."
---

# macchina

Use this skill to execute **macchina** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2479 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/Macchina-CLI/macchina
- **License:** MIT
- **Catalog description:** System information fetcher, with an emphasis on performance and minimalism
## Procedure
1. Confirm the tool is available.
   - `command -v macchina`
   - `macchina --version` (fallback: `macchina -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search macchina` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search macchina` then install the matching package.
   - Fedora/RHEL: `dnf search macchina` then install the matching package.
3. Inspect supported commands/options.
   - `macchina --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
