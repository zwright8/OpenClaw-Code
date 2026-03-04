---
name: gdrive
description: "Run and troubleshoot the gdrive command-line tool on local machines. Use when requests mention \"gdrive\" or require workflows supported by this tool."
---

# gdrive

Use this skill to execute **gdrive** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2330 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/glotlabs/gdrive
- **License:** MIT
- **Catalog description:** Google Drive CLI Client
## Procedure
1. Confirm the tool is available.
   - `command -v gdrive`
   - `gdrive --version` (fallback: `gdrive -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gdrive` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gdrive` then install the matching package.
   - Fedora/RHEL: `dnf search gdrive` then install the matching package.
3. Inspect supported commands/options.
   - `gdrive --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
