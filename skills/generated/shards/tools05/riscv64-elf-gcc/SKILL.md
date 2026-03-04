---
name: riscv64-elf-gcc
description: "Run and troubleshoot the riscv64-elf-gcc command-line tool on local machines. Use when requests mention \"riscv64-elf-gcc\" or require workflows supported by this tool."
---

# riscv64-elf-gcc

Use this skill to execute **riscv64-elf-gcc** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2359 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gcc.gnu.org
- **License:** GPL-3.0-or-later WITH GCC-exception-3.1
- **Catalog description:** GNU compiler collection for riscv64-elf
## Procedure
1. Confirm the tool is available.
   - `command -v riscv64-elf-gcc`
   - `riscv64-elf-gcc --version` (fallback: `riscv64-elf-gcc -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search riscv64-elf-gcc` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search riscv64-elf-gcc` then install the matching package.
   - Fedora/RHEL: `dnf search riscv64-elf-gcc` then install the matching package.
3. Inspect supported commands/options.
   - `riscv64-elf-gcc --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
