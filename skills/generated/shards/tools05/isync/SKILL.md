---
name: isync
description: "Run and troubleshoot the isync command-line tool on local machines. Use when requests mention \"isync\" or require workflows supported by this tool."
---

# isync

Use this skill to execute **isync** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2204 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://isync.sourceforge.io/
- **License:** GPL-2.0-or-later
- **Catalog description:** Synchronize a maildir with an IMAP server
## Procedure
1. Confirm the tool is available.
   - `command -v isync`
   - `isync --version` (fallback: `isync -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search isync` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search isync` then install the matching package.
   - Fedora/RHEL: `dnf search isync` then install the matching package.
3. Inspect supported commands/options.
   - `isync --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
