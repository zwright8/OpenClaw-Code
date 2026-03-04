---
name: uchardet
description: "Run and troubleshoot the uchardet command-line tool on local machines. Use when requests mention \"uchardet\" or require workflows supported by this tool."
---

# uchardet

Use this skill to execute **uchardet** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2064 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.freedesktop.org/wiki/Software/uchardet/
- **License:** MPL-1.1 OR GPL-2.0-or-later OR LGPL-2.1-or-later
- **Catalog description:** Encoding detector library
## Procedure
1. Confirm the tool is available.
   - `command -v uchardet`
   - `uchardet --version` (fallback: `uchardet -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search uchardet` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search uchardet` then install the matching package.
   - Fedora/RHEL: `dnf search uchardet` then install the matching package.
3. Inspect supported commands/options.
   - `uchardet --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
