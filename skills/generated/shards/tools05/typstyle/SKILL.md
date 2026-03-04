---
name: typstyle
description: "Run and troubleshoot the typstyle command-line tool on local machines. Use when requests mention \"typstyle\" or require workflows supported by this tool."
---

# typstyle

Use this skill to execute **typstyle** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2125 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://typstyle-rs.github.io/typstyle/
- **License:** Apache-2.0
- **Catalog description:** Beautiful and reliable typst code formatter
## Procedure
1. Confirm the tool is available.
   - `command -v typstyle`
   - `typstyle --version` (fallback: `typstyle -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search typstyle` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search typstyle` then install the matching package.
   - Fedora/RHEL: `dnf search typstyle` then install the matching package.
3. Inspect supported commands/options.
   - `typstyle --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
