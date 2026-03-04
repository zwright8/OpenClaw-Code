---
name: lxc
description: "Run and troubleshoot the lxc command-line tool on local machines. Use when requests mention \"lxc\" or require workflows supported by this tool."
---

# lxc

Use this skill to execute **lxc** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2447 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://ubuntu.com/lxd
- **License:** AGPL-3.0-only
- **Catalog description:** CLI client for interacting with LXD
## Procedure
1. Confirm the tool is available.
   - `command -v lxc`
   - `lxc --version` (fallback: `lxc -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search lxc` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search lxc` then install the matching package.
   - Fedora/RHEL: `dnf search lxc` then install the matching package.
3. Inspect supported commands/options.
   - `lxc --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
