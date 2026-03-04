---
name: htslib
description: "Run and troubleshoot the htslib command-line tool on local machines. Use when requests mention \"htslib\" or require workflows supported by this tool."
---

# htslib

Use this skill to execute **htslib** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2186 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.htslib.org/
- **License:** MIT AND BSD-3-Clause
- **Catalog description:** C library for high-throughput sequencing data formats
## Procedure
1. Confirm the tool is available.
   - `command -v htslib`
   - `htslib --version` (fallback: `htslib -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search htslib` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search htslib` then install the matching package.
   - Fedora/RHEL: `dnf search htslib` then install the matching package.
3. Inspect supported commands/options.
   - `htslib --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
