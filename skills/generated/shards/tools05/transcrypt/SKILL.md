---
name: transcrypt
description: "Run and troubleshoot the transcrypt command-line tool on local machines. Use when requests mention \"transcrypt\" or require workflows supported by this tool."
---

# transcrypt

Use this skill to execute **transcrypt** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2004 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/elasticdog/transcrypt
- **License:** MIT
- **Catalog description:** Configure transparent encryption of files in a Git repo
## Procedure
1. Confirm the tool is available.
   - `command -v transcrypt`
   - `transcrypt --version` (fallback: `transcrypt -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search transcrypt` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search transcrypt` then install the matching package.
   - Fedora/RHEL: `dnf search transcrypt` then install the matching package.
3. Inspect supported commands/options.
   - `transcrypt --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
