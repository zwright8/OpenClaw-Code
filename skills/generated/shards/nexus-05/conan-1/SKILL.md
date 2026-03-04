---
name: conan-1
description: "Run and troubleshoot the conan@1 command-line tool on local machines. Use when requests mention \"conan@1\" or require workflows supported by this tool."
---

# conan@1

Use this skill to execute **conan@1** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2189 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://conan.io
- **License:** MIT
- **Catalog description:** Distributed, open source, package manager for C/C++
- **Executable hint:** package/catalog name is `conan@1`, while the runnable binary is often `conan`.
## Procedure
1. Confirm the tool is available.
   - `command -v conan`
   - `conan --version` (fallback: `conan -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search conan@1` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search conan@1` then install the matching package.
   - Fedora/RHEL: `dnf search conan@1` then install the matching package.
3. Inspect supported commands/options.
   - `conan --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
