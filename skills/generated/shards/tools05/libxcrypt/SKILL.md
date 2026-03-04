---
name: libxcrypt
description: "Run and troubleshoot the libxcrypt command-line tool on local machines. Use when requests mention \"libxcrypt\" or require workflows supported by this tool."
---

# libxcrypt

Use this skill to execute **libxcrypt** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2279 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/besser82/libxcrypt
- **License:** LGPL-2.1-or-later
- **Catalog description:** Extended crypt library for descrypt, md5crypt, bcrypt, and others
## Procedure
1. Confirm the tool is available.
   - `command -v libxcrypt`
   - `libxcrypt --version` (fallback: `libxcrypt -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libxcrypt` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libxcrypt` then install the matching package.
   - Fedora/RHEL: `dnf search libxcrypt` then install the matching package.
3. Inspect supported commands/options.
   - `libxcrypt --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
