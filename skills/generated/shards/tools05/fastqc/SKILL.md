---
name: fastqc
description: "Run and troubleshoot the fastqc command-line tool on local machines. Use when requests mention \"fastqc\" or require workflows supported by this tool."
---

# fastqc

Use this skill to execute **fastqc** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2084 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.bioinformatics.babraham.ac.uk/projects/fastqc/
- **License:** GPL-3.0-or-later
- **Catalog description:** Quality control tool for high throughput sequence data
## Procedure
1. Confirm the tool is available.
   - `command -v fastqc`
   - `fastqc --version` (fallback: `fastqc -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search fastqc` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search fastqc` then install the matching package.
   - Fedora/RHEL: `dnf search fastqc` then install the matching package.
3. Inspect supported commands/options.
   - `fastqc --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
