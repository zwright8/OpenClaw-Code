---
name: bullet
description: "Run and troubleshoot the bullet command-line tool on local machines. Use when requests mention \"bullet\" or require workflows supported by this tool."
---

# bullet

Use this skill to execute **bullet** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2471 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://bulletphysics.org/
- **License:** Zlib
- **Catalog description:** Physics SDK
## Procedure
1. Confirm the tool is available.
   - `command -v bullet`
   - `bullet --version` (fallback: `bullet -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search bullet` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search bullet` then install the matching package.
   - Fedora/RHEL: `dnf search bullet` then install the matching package.
3. Inspect supported commands/options.
   - `bullet --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
