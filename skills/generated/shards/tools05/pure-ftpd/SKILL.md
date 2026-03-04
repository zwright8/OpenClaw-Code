---
name: pure-ftpd
description: "Run and troubleshoot the pure-ftpd command-line tool on local machines. Use when requests mention \"pure-ftpd\" or require workflows supported by this tool."
---

# pure-ftpd

Use this skill to execute **pure-ftpd** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2455 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.pureftpd.org/
- **License:** BSD-2-Clause AND BSD-3-Clause AND BSD-4-Clause AND ISC
- **Catalog description:** Secure and efficient FTP server
## Procedure
1. Confirm the tool is available.
   - `command -v pure-ftpd`
   - `pure-ftpd --version` (fallback: `pure-ftpd -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search pure-ftpd` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search pure-ftpd` then install the matching package.
   - Fedora/RHEL: `dnf search pure-ftpd` then install the matching package.
3. Inspect supported commands/options.
   - `pure-ftpd --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
