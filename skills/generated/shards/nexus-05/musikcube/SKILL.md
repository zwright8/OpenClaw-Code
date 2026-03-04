---
name: musikcube
description: "Run and troubleshoot the musikcube command-line tool on local machines. Use when requests mention \"musikcube\" or require workflows supported by this tool."
---

# musikcube

Use this skill to execute **musikcube** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2457 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://musikcube.com
- **License:** BSD-3-Clause AND GPL-2.0-or-later AND LGPL-2.1-or-later AND BSL-1.0 AND MIT AND Zlib AND bcrypt-Solar-Designer AND blessing
- **Catalog description:** Terminal-based audio engine, library, player and server
## Procedure
1. Confirm the tool is available.
   - `command -v musikcube`
   - `musikcube --version` (fallback: `musikcube -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search musikcube` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search musikcube` then install the matching package.
   - Fedora/RHEL: `dnf search musikcube` then install the matching package.
3. Inspect supported commands/options.
   - `musikcube --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
