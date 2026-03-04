---
name: howdoi
description: "Run and troubleshoot the howdoi command-line tool on local machines. Use when requests mention \"howdoi\" or require workflows supported by this tool."
---

# howdoi

Use this skill to execute **howdoi** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2075 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/gleitz/howdoi
- **License:** MIT
- **Catalog description:** Instant coding answers via the command-line
## Procedure
1. Confirm the tool is available.
   - `command -v howdoi`
   - `howdoi --version` (fallback: `howdoi -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search howdoi` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search howdoi` then install the matching package.
   - Fedora/RHEL: `dnf search howdoi` then install the matching package.
3. Inspect supported commands/options.
   - `howdoi --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
