---
name: seqkit
description: "Run and troubleshoot the seqkit command-line tool on local machines. Use when requests mention \"seqkit\" or require workflows supported by this tool."
---

# seqkit

Use this skill to execute **seqkit** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2088 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://bioinf.shenwei.me/seqkit
- **License:** MIT
- **Catalog description:** Cross-platform and ultrafast toolkit for FASTA/Q file manipulation in Golang
## Procedure
1. Confirm the tool is available.
   - `command -v seqkit`
   - `seqkit --version` (fallback: `seqkit -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search seqkit` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search seqkit` then install the matching package.
   - Fedora/RHEL: `dnf search seqkit` then install the matching package.
3. Inspect supported commands/options.
   - `seqkit --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
