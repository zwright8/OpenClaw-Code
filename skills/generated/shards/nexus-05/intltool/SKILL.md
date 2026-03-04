---
name: intltool
description: "Run and troubleshoot the intltool command-line tool on local machines. Use when requests mention \"intltool\" or require workflows supported by this tool."
---

# intltool

Use this skill to execute **intltool** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2387 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://wiki.freedesktop.org/www/Software/intltool
- **License:** GPL-2.0-or-later
- **Catalog description:** String tool
## Procedure
1. Confirm the tool is available.
   - `command -v intltool`
   - `intltool --version` (fallback: `intltool -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search intltool` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search intltool` then install the matching package.
   - Fedora/RHEL: `dnf search intltool` then install the matching package.
3. Inspect supported commands/options.
   - `intltool --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
