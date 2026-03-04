---
name: icu4c-75
description: "Run and troubleshoot the icu4c@75 command-line tool on local machines. Use when requests mention \"icu4c@75\" or require workflows supported by this tool."
---

# icu4c@75

Use this skill to execute **icu4c@75** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2288 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://icu.unicode.org/home
- **License:** ICU
- **Catalog description:** C/C++ and Java libraries for Unicode and globalization
- **Executable hint:** package/catalog name is `icu4c@75`, while the runnable binary is often `icu4c`.
## Procedure
1. Confirm the tool is available.
   - `command -v icu4c`
   - `icu4c --version` (fallback: `icu4c -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search icu4c@75` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search icu4c@75` then install the matching package.
   - Fedora/RHEL: `dnf search icu4c@75` then install the matching package.
3. Inspect supported commands/options.
   - `icu4c --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
