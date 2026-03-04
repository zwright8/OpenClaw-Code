---
name: mat2
description: "Run and troubleshoot the mat2 command-line tool on local machines. Use when requests mention \"mat2\" or require workflows supported by this tool."
---

# mat2

Use this skill to execute **mat2** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2394 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/jvoisin/mat2
- **License:** LGPL-3.0-or-later
- **Catalog description:** Metadata anonymization toolkit
## Procedure
1. Confirm the tool is available.
   - `command -v mat2`
   - `mat2 --version` (fallback: `mat2 -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mat2` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mat2` then install the matching package.
   - Fedora/RHEL: `dnf search mat2` then install the matching package.
3. Inspect supported commands/options.
   - `mat2 --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
