---
name: marked
description: "Run and troubleshoot the marked command-line tool on local machines. Use when requests mention \"marked\" or require workflows supported by this tool."
---

# marked

Use this skill to execute **marked** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2165 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://marked.js.org/
- **License:** MIT
- **Catalog description:** Markdown parser and compiler built for speed
## Procedure
1. Confirm the tool is available.
   - `command -v marked`
   - `marked --version` (fallback: `marked -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search marked` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search marked` then install the matching package.
   - Fedora/RHEL: `dnf search marked` then install the matching package.
3. Inspect supported commands/options.
   - `marked --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
