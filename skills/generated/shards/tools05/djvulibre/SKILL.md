---
name: djvulibre
description: "Run and troubleshoot the djvulibre command-line tool on local machines. Use when requests mention \"djvulibre\" or require workflows supported by this tool."
---

# djvulibre

Use this skill to execute **djvulibre** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2258 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://djvu.sourceforge.net/
- **License:** GPL-2.0-or-later
- **Catalog description:** DjVu viewer
## Procedure
1. Confirm the tool is available.
   - `command -v djvulibre`
   - `djvulibre --version` (fallback: `djvulibre -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search djvulibre` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search djvulibre` then install the matching package.
   - Fedora/RHEL: `dnf search djvulibre` then install the matching package.
3. Inspect supported commands/options.
   - `djvulibre --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
