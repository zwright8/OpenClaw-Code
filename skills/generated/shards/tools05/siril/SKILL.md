---
name: siril
description: "Run and troubleshoot the siril command-line tool on local machines. Use when requests mention \"siril\" or require workflows supported by this tool."
---

# siril

Use this skill to execute **siril** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2408 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.siril.org
- **License:** GPL-3.0-or-later
- **Catalog description:** Astronomical image processing tool
## Procedure
1. Confirm the tool is available.
   - `command -v siril`
   - `siril --version` (fallback: `siril -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search siril` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search siril` then install the matching package.
   - Fedora/RHEL: `dnf search siril` then install the matching package.
3. Inspect supported commands/options.
   - `siril --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
