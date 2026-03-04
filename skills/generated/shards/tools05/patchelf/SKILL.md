---
name: patchelf
description: "Run and troubleshoot the patchelf command-line tool on local machines. Use when requests mention \"patchelf\" or require workflows supported by this tool."
---

# patchelf

Use this skill to execute **patchelf** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2211 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/NixOS/patchelf
- **License:** GPL-3.0-or-later
- **Catalog description:** Modify dynamic ELF executables
## Procedure
1. Confirm the tool is available.
   - `command -v patchelf`
   - `patchelf --version` (fallback: `patchelf -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search patchelf` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search patchelf` then install the matching package.
   - Fedora/RHEL: `dnf search patchelf` then install the matching package.
3. Inspect supported commands/options.
   - `patchelf --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
