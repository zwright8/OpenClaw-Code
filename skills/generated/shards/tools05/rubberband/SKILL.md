---
name: rubberband
description: "Run and troubleshoot the rubberband command-line tool on local machines. Use when requests mention \"rubberband\" or require workflows supported by this tool."
---

# rubberband

Use this skill to execute **rubberband** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2073 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://breakfastquay.com/rubberband/
- **License:** GPL-2.0-or-later
- **Catalog description:** Audio time stretcher tool and library
## Procedure
1. Confirm the tool is available.
   - `command -v rubberband`
   - `rubberband --version` (fallback: `rubberband -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search rubberband` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search rubberband` then install the matching package.
   - Fedora/RHEL: `dnf search rubberband` then install the matching package.
3. Inspect supported commands/options.
   - `rubberband --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
