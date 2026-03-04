---
name: jruby
description: "Run and troubleshoot the jruby command-line tool on local machines. Use when requests mention \"jruby\" or require workflows supported by this tool."
---

# jruby

Use this skill to execute **jruby** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2465 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.jruby.org/
- **License:** EPL-2.0 OR GPL-2.0-only OR LGPL-2.1-only
- **Catalog description:** Ruby implementation in pure Java
## Procedure
1. Confirm the tool is available.
   - `command -v jruby`
   - `jruby --version` (fallback: `jruby -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search jruby` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search jruby` then install the matching package.
   - Fedora/RHEL: `dnf search jruby` then install the matching package.
3. Inspect supported commands/options.
   - `jruby --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
