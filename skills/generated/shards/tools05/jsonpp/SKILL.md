---
name: jsonpp
description: "Run and troubleshoot the jsonpp command-line tool on local machines. Use when requests mention \"jsonpp\" or require workflows supported by this tool."
---

# jsonpp

Use this skill to execute **jsonpp** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2299 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://jmhodges.github.io/jsonpp/
- **License:** MIT
- **Catalog description:** Command-line JSON pretty-printer
## Procedure
1. Confirm the tool is available.
   - `command -v jsonpp`
   - `jsonpp --version` (fallback: `jsonpp -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search jsonpp` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search jsonpp` then install the matching package.
   - Fedora/RHEL: `dnf search jsonpp` then install the matching package.
3. Inspect supported commands/options.
   - `jsonpp --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
