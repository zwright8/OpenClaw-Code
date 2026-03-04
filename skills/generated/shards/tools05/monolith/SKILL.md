---
name: monolith
description: "Run and troubleshoot the monolith command-line tool on local machines. Use when requests mention \"monolith\" or require workflows supported by this tool."
---

# monolith

Use this skill to execute **monolith** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2281 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/Y2Z/monolith
- **License:** CC0-1.0
- **Catalog description:** CLI tool for saving complete web pages as a single HTML file
## Procedure
1. Confirm the tool is available.
   - `command -v monolith`
   - `monolith --version` (fallback: `monolith -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search monolith` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search monolith` then install the matching package.
   - Fedora/RHEL: `dnf search monolith` then install the matching package.
3. Inspect supported commands/options.
   - `monolith --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
