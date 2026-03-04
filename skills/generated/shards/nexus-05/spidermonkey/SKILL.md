---
name: spidermonkey
description: "Run and troubleshoot the spidermonkey command-line tool on local machines. Use when requests mention \"spidermonkey\" or require workflows supported by this tool."
---

# spidermonkey

Use this skill to execute **spidermonkey** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2078 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://spidermonkey.dev
- **License:** MPL-2.0
- **Catalog description:** JavaScript-C Engine
## Procedure
1. Confirm the tool is available.
   - `command -v spidermonkey`
   - `spidermonkey --version` (fallback: `spidermonkey -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search spidermonkey` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search spidermonkey` then install the matching package.
   - Fedora/RHEL: `dnf search spidermonkey` then install the matching package.
3. Inspect supported commands/options.
   - `spidermonkey --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
