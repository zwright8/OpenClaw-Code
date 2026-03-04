---
name: povray
description: "Run and troubleshoot the povray command-line tool on local machines. Use when requests mention \"povray\" or require workflows supported by this tool."
---

# povray

Use this skill to execute **povray** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2338 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.povray.org/
- **License:** AGPL-3.0-or-later
- **Catalog description:** Persistence Of Vision RAYtracer (POVRAY)
## Procedure
1. Confirm the tool is available.
   - `command -v povray`
   - `povray --version` (fallback: `povray -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search povray` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search povray` then install the matching package.
   - Fedora/RHEL: `dnf search povray` then install the matching package.
3. Inspect supported commands/options.
   - `povray --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
