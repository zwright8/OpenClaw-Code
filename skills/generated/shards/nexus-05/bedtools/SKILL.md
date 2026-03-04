---
name: bedtools
description: "Run and troubleshoot the bedtools command-line tool on local machines. Use when requests mention \"bedtools\" or require workflows supported by this tool."
---

# bedtools

Use this skill to execute **bedtools** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2239 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/arq5x/bedtools2
- **License:** MIT
- **Catalog description:** Tools for genome arithmetic (set theory on the genome)
## Procedure
1. Confirm the tool is available.
   - `command -v bedtools`
   - `bedtools --version` (fallback: `bedtools -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search bedtools` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search bedtools` then install the matching package.
   - Fedora/RHEL: `dnf search bedtools` then install the matching package.
3. Inspect supported commands/options.
   - `bedtools --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
