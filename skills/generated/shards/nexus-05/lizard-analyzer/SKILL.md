---
name: lizard-analyzer
description: "Run and troubleshoot the lizard-analyzer command-line tool on local machines. Use when requests mention \"lizard-analyzer\" or require workflows supported by this tool."
---

# lizard-analyzer

Use this skill to execute **lizard-analyzer** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2453 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/terryyin/lizard
- **License:** MIT
- **Catalog description:** Extensible Cyclomatic Complexity Analyzer
## Procedure
1. Confirm the tool is available.
   - `command -v lizard-analyzer`
   - `lizard-analyzer --version` (fallback: `lizard-analyzer -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search lizard-analyzer` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search lizard-analyzer` then install the matching package.
   - Fedora/RHEL: `dnf search lizard-analyzer` then install the matching package.
3. Inspect supported commands/options.
   - `lizard-analyzer --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
