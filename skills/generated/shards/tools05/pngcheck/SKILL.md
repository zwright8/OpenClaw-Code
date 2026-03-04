---
name: pngcheck
description: "Run and troubleshoot the pngcheck command-line tool on local machines. Use when requests mention \"pngcheck\" or require workflows supported by this tool."
---

# pngcheck

Use this skill to execute **pngcheck** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2287 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/pnggroup/pngcheck
- **License:** HPND
- **Catalog description:** Print info and check PNG, JNG, and MNG files
## Procedure
1. Confirm the tool is available.
   - `command -v pngcheck`
   - `pngcheck --version` (fallback: `pngcheck -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search pngcheck` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search pngcheck` then install the matching package.
   - Fedora/RHEL: `dnf search pngcheck` then install the matching package.
3. Inspect supported commands/options.
   - `pngcheck --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
