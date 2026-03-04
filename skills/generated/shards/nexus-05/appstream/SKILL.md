---
name: appstream
description: "Run and troubleshoot the appstream command-line tool on local machines. Use when requests mention \"appstream\" or require workflows supported by this tool."
---

# appstream

Use this skill to execute **appstream** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2441 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.freedesktop.org/wiki/Distributions/AppStream/
- **License:** LGPL-2.1-or-later
- **Catalog description:** Tools and libraries to work with AppStream metadata
## Procedure
1. Confirm the tool is available.
   - `command -v appstream`
   - `appstream --version` (fallback: `appstream -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search appstream` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search appstream` then install the matching package.
   - Fedora/RHEL: `dnf search appstream` then install the matching package.
3. Inspect supported commands/options.
   - `appstream --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
