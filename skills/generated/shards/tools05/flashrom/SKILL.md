---
name: flashrom
description: "Run and troubleshoot the flashrom command-line tool on local machines. Use when requests mention \"flashrom\" or require workflows supported by this tool."
---

# flashrom

Use this skill to execute **flashrom** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2076 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://flashrom.org/
- **License:** GPL-2.0-or-later
- **Catalog description:** Identify, read, write, verify, and erase flash chips
## Procedure
1. Confirm the tool is available.
   - `command -v flashrom`
   - `flashrom --version` (fallback: `flashrom -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search flashrom` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search flashrom` then install the matching package.
   - Fedora/RHEL: `dnf search flashrom` then install the matching package.
3. Inspect supported commands/options.
   - `flashrom --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
