---
name: physfs
description: "Run and troubleshoot the physfs command-line tool on local machines. Use when requests mention \"physfs\" or require workflows supported by this tool."
---

# physfs

Use this skill to execute **physfs** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2234 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://icculus.org/physfs/
- **License:** Zlib
- **Catalog description:** Library to provide abstract access to various archives
## Procedure
1. Confirm the tool is available.
   - `command -v physfs`
   - `physfs --version` (fallback: `physfs -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search physfs` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search physfs` then install the matching package.
   - Fedora/RHEL: `dnf search physfs` then install the matching package.
3. Inspect supported commands/options.
   - `physfs --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
