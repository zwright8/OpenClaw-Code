---
name: botan
description: "Run and troubleshoot the botan command-line tool on local machines. Use when requests mention \"botan\" or require workflows supported by this tool."
---

# botan

Use this skill to execute **botan** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2026 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://botan.randombit.net/
- **License:** BSD-2-Clause
- **Catalog description:** Cryptographic algorithms and formats library in C++
## Procedure
1. Confirm the tool is available.
   - `command -v botan`
   - `botan --version` (fallback: `botan -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search botan` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search botan` then install the matching package.
   - Fedora/RHEL: `dnf search botan` then install the matching package.
3. Inspect supported commands/options.
   - `botan --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
