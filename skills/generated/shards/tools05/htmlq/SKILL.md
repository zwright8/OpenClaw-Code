---
name: htmlq
description: "Run and troubleshoot the htmlq command-line tool on local machines. Use when requests mention \"htmlq\" or require workflows supported by this tool."
---

# htmlq

Use this skill to execute **htmlq** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2358 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/mgdm/htmlq
- **License:** MIT
- **Catalog description:** Uses CSS selectors to extract bits content from HTML files
## Procedure
1. Confirm the tool is available.
   - `command -v htmlq`
   - `htmlq --version` (fallback: `htmlq -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search htmlq` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search htmlq` then install the matching package.
   - Fedora/RHEL: `dnf search htmlq` then install the matching package.
3. Inspect supported commands/options.
   - `htmlq --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
