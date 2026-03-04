---
name: libaacs
description: "Run and troubleshoot the libaacs command-line tool on local machines. Use when requests mention \"libaacs\" or require workflows supported by this tool."
---

# libaacs

Use this skill to execute **libaacs** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2191 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.videolan.org/developers/libaacs.html
- **License:** LGPL-2.1-or-later
- **Catalog description:** Implements the Advanced Access Content System specification
## Procedure
1. Confirm the tool is available.
   - `command -v libaacs`
   - `libaacs --version` (fallback: `libaacs -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libaacs` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libaacs` then install the matching package.
   - Fedora/RHEL: `dnf search libaacs` then install the matching package.
3. Inspect supported commands/options.
   - `libaacs --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
