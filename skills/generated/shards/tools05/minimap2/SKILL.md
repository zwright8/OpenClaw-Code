---
name: minimap2
description: "Run and troubleshoot the minimap2 command-line tool on local machines. Use when requests mention \"minimap2\" or require workflows supported by this tool."
---

# minimap2

Use this skill to execute **minimap2** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2458 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://lh3.github.io/minimap2
- **License:** MIT
- **Catalog description:** Versatile pairwise aligner for genomic and spliced nucleotide sequences
## Procedure
1. Confirm the tool is available.
   - `command -v minimap2`
   - `minimap2 --version` (fallback: `minimap2 -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search minimap2` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search minimap2` then install the matching package.
   - Fedora/RHEL: `dnf search minimap2` then install the matching package.
3. Inspect supported commands/options.
   - `minimap2 --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
