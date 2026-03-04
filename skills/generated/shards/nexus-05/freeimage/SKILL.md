---
name: freeimage
description: "Run and troubleshoot the freeimage command-line tool on local machines. Use when requests mention \"freeimage\" or require workflows supported by this tool."
---

# freeimage

Use this skill to execute **freeimage** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2423 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://sourceforge.net/projects/freeimage/
- **License:** FreeImage
- **Catalog description:** Library for FreeImage, a dependency-free graphics library
## Procedure
1. Confirm the tool is available.
   - `command -v freeimage`
   - `freeimage --version` (fallback: `freeimage -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search freeimage` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search freeimage` then install the matching package.
   - Fedora/RHEL: `dnf search freeimage` then install the matching package.
3. Inspect supported commands/options.
   - `freeimage --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
