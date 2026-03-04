---
name: atomicparsley
description: "Run and troubleshoot the atomicparsley command-line tool on local machines. Use when requests mention \"atomicparsley\" or require workflows supported by this tool."
---

# atomicparsley

Use this skill to execute **atomicparsley** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2141 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/wez/atomicparsley
- **License:** GPL-2.0-or-later
- **Catalog description:** MPEG-4 command-line tool
## Procedure
1. Confirm the tool is available.
   - `command -v atomicparsley`
   - `atomicparsley --version` (fallback: `atomicparsley -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search atomicparsley` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search atomicparsley` then install the matching package.
   - Fedora/RHEL: `dnf search atomicparsley` then install the matching package.
3. Inspect supported commands/options.
   - `atomicparsley --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
