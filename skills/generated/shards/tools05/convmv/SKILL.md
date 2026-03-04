---
name: convmv
description: "Run and troubleshoot the convmv command-line tool on local machines. Use when requests mention \"convmv\" or require workflows supported by this tool."
---

# convmv

Use this skill to execute **convmv** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2208 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.j3e.de/linux/convmv/
- **License:** GPL-2.0-or-later
- **Catalog description:** Filename encoding conversion tool
## Procedure
1. Confirm the tool is available.
   - `command -v convmv`
   - `convmv --version` (fallback: `convmv -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search convmv` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search convmv` then install the matching package.
   - Fedora/RHEL: `dnf search convmv` then install the matching package.
3. Inspect supported commands/options.
   - `convmv --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
