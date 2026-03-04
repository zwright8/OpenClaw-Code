---
name: libnfs
description: "Run and troubleshoot the libnfs command-line tool on local machines. Use when requests mention \"libnfs\" or require workflows supported by this tool."
---

# libnfs

Use this skill to execute **libnfs** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2180 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/sahlberg/libnfs
- **License:** LGPL-2.1-or-later
- **Catalog description:** C client library for NFS
## Procedure
1. Confirm the tool is available.
   - `command -v libnfs`
   - `libnfs --version` (fallback: `libnfs -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libnfs` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libnfs` then install the matching package.
   - Fedora/RHEL: `dnf search libnfs` then install the matching package.
3. Inspect supported commands/options.
   - `libnfs --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
