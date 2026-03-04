---
name: siege
description: "Run and troubleshoot the siege command-line tool on local machines. Use when requests mention \"siege\" or require workflows supported by this tool."
---

# siege

Use this skill to execute **siege** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2219 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.joedog.org/siege
- **License:** GPL-3.0-or-later
- **Catalog description:** HTTP regression testing and benchmarking utility
## Procedure
1. Confirm the tool is available.
   - `command -v siege`
   - `siege --version` (fallback: `siege -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search siege` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search siege` then install the matching package.
   - Fedora/RHEL: `dnf search siege` then install the matching package.
3. Inspect supported commands/options.
   - `siege --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
