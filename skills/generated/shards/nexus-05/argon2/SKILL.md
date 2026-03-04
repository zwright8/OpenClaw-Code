---
name: argon2
description: "Run and troubleshoot the argon2 command-line tool on local machines. Use when requests mention \"argon2\" or require workflows supported by this tool."
---

# argon2

Use this skill to execute **argon2** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2347 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/P-H-C/phc-winner-argon2
- **License:** Apache-2.0
- **Catalog description:** Password hashing library and CLI utility
## Procedure
1. Confirm the tool is available.
   - `command -v argon2`
   - `argon2 --version` (fallback: `argon2 -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search argon2` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search argon2` then install the matching package.
   - Fedora/RHEL: `dnf search argon2` then install the matching package.
3. Inspect supported commands/options.
   - `argon2 --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
