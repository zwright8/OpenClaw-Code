---
name: datasette
description: "Run and troubleshoot the datasette command-line tool on local machines. Use when requests mention \"datasette\" or require workflows supported by this tool."
---

# datasette

Use this skill to execute **datasette** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2139 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://docs.datasette.io/en/stable/
- **License:** Apache-2.0
- **Catalog description:** Open source multi-tool for exploring and publishing data
## Procedure
1. Confirm the tool is available.
   - `command -v datasette`
   - `datasette --version` (fallback: `datasette -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search datasette` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search datasette` then install the matching package.
   - Fedora/RHEL: `dnf search datasette` then install the matching package.
3. Inspect supported commands/options.
   - `datasette --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
