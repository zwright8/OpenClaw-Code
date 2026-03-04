---
name: web-ext
description: "Run and troubleshoot the web-ext command-line tool on local machines. Use when requests mention \"web-ext\" or require workflows supported by this tool."
---

# web-ext

Use this skill to execute **web-ext** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2123 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/mozilla/web-ext
- **License:** MPL-2.0
- **Catalog description:** Command-line tool to help build, run, and test web extensions
## Procedure
1. Confirm the tool is available.
   - `command -v web-ext`
   - `web-ext --version` (fallback: `web-ext -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search web-ext` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search web-ext` then install the matching package.
   - Fedora/RHEL: `dnf search web-ext` then install the matching package.
3. Inspect supported commands/options.
   - `web-ext --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
