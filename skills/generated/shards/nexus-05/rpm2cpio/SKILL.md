---
name: rpm2cpio
description: "Run and troubleshoot the rpm2cpio command-line tool on local machines. Use when requests mention \"rpm2cpio\" or require workflows supported by this tool."
---

# rpm2cpio

Use this skill to execute **rpm2cpio** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2149 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://svnweb.freebsd.org/ports/head/archivers/rpm2cpio/
- **License:** BSD-2-Clause
- **Catalog description:** Tool to convert RPM package to CPIO archive
## Procedure
1. Confirm the tool is available.
   - `command -v rpm2cpio`
   - `rpm2cpio --version` (fallback: `rpm2cpio -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search rpm2cpio` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search rpm2cpio` then install the matching package.
   - Fedora/RHEL: `dnf search rpm2cpio` then install the matching package.
3. Inspect supported commands/options.
   - `rpm2cpio --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
