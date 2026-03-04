---
name: svgo
description: "Run and troubleshoot the svgo command-line tool on local machines. Use when requests mention \"svgo\" or require workflows supported by this tool."
---

# svgo

Use this skill to execute **svgo** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2018 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://svgo.dev/
- **License:** MIT
- **Catalog description:** Nodejs-based tool for optimizing SVG vector graphics files
## Procedure
1. Confirm the tool is available.
   - `command -v svgo`
   - `svgo --version` (fallback: `svgo -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search svgo` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search svgo` then install the matching package.
   - Fedora/RHEL: `dnf search svgo` then install the matching package.
3. Inspect supported commands/options.
   - `svgo --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
