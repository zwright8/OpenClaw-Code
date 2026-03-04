---
name: kingfisher
description: "Run and troubleshoot the kingfisher command-line tool on local machines. Use when requests mention \"kingfisher\" or require workflows supported by this tool."
---

# kingfisher

Use this skill to execute **kingfisher** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2117 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/mongodb/kingfisher
- **License:** Apache-2.0
- **Catalog description:** MongoDB's blazingly fast secret scanning and validation tool
## Procedure
1. Confirm the tool is available.
   - `command -v kingfisher`
   - `kingfisher --version` (fallback: `kingfisher -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search kingfisher` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search kingfisher` then install the matching package.
   - Fedora/RHEL: `dnf search kingfisher` then install the matching package.
3. Inspect supported commands/options.
   - `kingfisher --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
