---
name: zk
description: "Run and troubleshoot the zk command-line tool on local machines. Use when requests mention \"zk\" or require workflows supported by this tool."
---

# zk

Use this skill to execute **zk** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2373 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://zk-org.github.io/zk/
- **License:** GPL-3.0-only
- **Catalog description:** Plain text note-taking assistant
## Procedure
1. Confirm the tool is available.
   - `command -v zk`
   - `zk --version` (fallback: `zk -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search zk` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search zk` then install the matching package.
   - Fedora/RHEL: `dnf search zk` then install the matching package.
3. Inspect supported commands/options.
   - `zk --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
