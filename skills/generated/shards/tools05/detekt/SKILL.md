---
name: detekt
description: "Run and troubleshoot the detekt command-line tool on local machines. Use when requests mention \"detekt\" or require workflows supported by this tool."
---

# detekt

Use this skill to execute **detekt** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2487 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/detekt/detekt
- **License:** Apache-2.0
- **Catalog description:** Static code analysis for Kotlin
## Procedure
1. Confirm the tool is available.
   - `command -v detekt`
   - `detekt --version` (fallback: `detekt -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search detekt` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search detekt` then install the matching package.
   - Fedora/RHEL: `dnf search detekt` then install the matching package.
3. Inspect supported commands/options.
   - `detekt --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
