---
name: evernote-backup
description: "Run and troubleshoot the evernote-backup command-line tool on local machines. Use when requests mention \"evernote-backup\" or require workflows supported by this tool."
---

# evernote-backup

Use this skill to execute **evernote-backup** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2374 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/vzhd1701/evernote-backup
- **License:** MIT
- **Catalog description:** Backup & export all Evernote notes and notebooks
## Procedure
1. Confirm the tool is available.
   - `command -v evernote-backup`
   - `evernote-backup --version` (fallback: `evernote-backup -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search evernote-backup` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search evernote-backup` then install the matching package.
   - Fedora/RHEL: `dnf search evernote-backup` then install the matching package.
3. Inspect supported commands/options.
   - `evernote-backup --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
