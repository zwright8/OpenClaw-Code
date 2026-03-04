---
name: jdupes
description: "Run and troubleshoot the jdupes command-line tool on local machines. Use when requests mention \"jdupes\" or require workflows supported by this tool."
---

# jdupes

Use this skill to execute **jdupes** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2036 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://codeberg.org/jbruchon/jdupes
- **License:** MIT
- **Catalog description:** Duplicate file finder and an enhanced fork of 'fdupes'
## Procedure
1. Confirm the tool is available.
   - `command -v jdupes`
   - `jdupes --version` (fallback: `jdupes -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search jdupes` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search jdupes` then install the matching package.
   - Fedora/RHEL: `dnf search jdupes` then install the matching package.
3. Inspect supported commands/options.
   - `jdupes --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
