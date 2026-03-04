---
name: cpulimit
description: "Run and troubleshoot the cpulimit command-line tool on local machines. Use when requests mention \"cpulimit\" or require workflows supported by this tool."
---

# cpulimit

Use this skill to execute **cpulimit** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2316 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/opsengine/cpulimit
- **License:** GPL-2.0-or-later
- **Catalog description:** CPU usage limiter
## Procedure
1. Confirm the tool is available.
   - `command -v cpulimit`
   - `cpulimit --version` (fallback: `cpulimit -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search cpulimit` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search cpulimit` then install the matching package.
   - Fedora/RHEL: `dnf search cpulimit` then install the matching package.
3. Inspect supported commands/options.
   - `cpulimit --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
