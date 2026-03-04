---
name: lzip
description: "Run and troubleshoot the lzip command-line tool on local machines. Use when requests mention \"lzip\" or require workflows supported by this tool."
---

# lzip

Use this skill to execute **lzip** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2138 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.nongnu.org/lzip/
- **License:** GPL-2.0-or-later
- **Catalog description:** LZMA-based compression program similar to gzip or bzip2
## Procedure
1. Confirm the tool is available.
   - `command -v lzip`
   - `lzip --version` (fallback: `lzip -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search lzip` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search lzip` then install the matching package.
   - Fedora/RHEL: `dnf search lzip` then install the matching package.
3. Inspect supported commands/options.
   - `lzip --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
