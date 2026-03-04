---
name: x86-64-elf-binutils
description: "Run and troubleshoot the x86_64-elf-binutils command-line tool on local machines. Use when requests mention \"x86_64-elf-binutils\" or require workflows supported by this tool."
---

# x86_64-elf-binutils

Use this skill to execute **x86_64-elf-binutils** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2353 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.gnu.org/software/binutils/
- **License:** GPL-3.0-or-later
- **Catalog description:** GNU Binutils for x86_64-elf cross development
## Procedure
1. Confirm the tool is available.
   - `command -v x86_64-elf-binutils`
   - `x86_64-elf-binutils --version` (fallback: `x86_64-elf-binutils -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search x86_64-elf-binutils` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search x86_64-elf-binutils` then install the matching package.
   - Fedora/RHEL: `dnf search x86_64-elf-binutils` then install the matching package.
3. Inspect supported commands/options.
   - `x86_64-elf-binutils --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
