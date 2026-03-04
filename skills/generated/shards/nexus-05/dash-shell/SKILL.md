---
name: dash-shell
description: "Run and troubleshoot the dash-shell command-line tool on local machines. Use when requests mention \"dash-shell\" or require workflows supported by this tool."
---

# dash-shell

Use this skill to execute **dash-shell** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2456 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** http://gondor.apana.org.au/~herbert/dash/
- **License:** BSD-3-Clause
- **Catalog description:** POSIX-compliant descendant of NetBSD's ash (the Almquist SHell)
## Procedure
1. Confirm the tool is available.
   - `command -v dash-shell`
   - `dash-shell --version` (fallback: `dash-shell -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search dash-shell` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search dash-shell` then install the matching package.
   - Fedora/RHEL: `dnf search dash-shell` then install the matching package.
3. Inspect supported commands/options.
   - `dash-shell --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
