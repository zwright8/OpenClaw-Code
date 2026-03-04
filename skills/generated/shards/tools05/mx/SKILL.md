---
name: mx
description: "Run and troubleshoot the mx command-line tool on local machines. Use when requests mention \"mx\" or require workflows supported by this tool."
---

# mx

Use this skill to execute **mx** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2386 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/graalvm/mx
- **License:** GPL-2.0-only
- **Catalog description:** Command-line tool used for the development of Graal projects
## Procedure
1. Confirm the tool is available.
   - `command -v mx`
   - `mx --version` (fallback: `mx -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mx` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mx` then install the matching package.
   - Fedora/RHEL: `dnf search mx` then install the matching package.
3. Inspect supported commands/options.
   - `mx --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
