---
name: afflib
description: "Run and troubleshoot the afflib command-line tool on local machines. Use when requests mention \"afflib\" or require workflows supported by this tool."
---

# afflib

Use this skill to execute **afflib** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2135 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/sshock/AFFLIBv3
- **License:** BSD-4-Clause AND LicenseRef-Homebrew-public-domain
- **Catalog description:** Advanced Forensic Format
## Procedure
1. Confirm the tool is available.
   - `command -v afflib`
   - `afflib --version` (fallback: `afflib -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search afflib` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search afflib` then install the matching package.
   - Fedora/RHEL: `dnf search afflib` then install the matching package.
3. Inspect supported commands/options.
   - `afflib --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
