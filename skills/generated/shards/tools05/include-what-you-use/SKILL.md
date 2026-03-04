---
name: include-what-you-use
description: "Run and troubleshoot the include-what-you-use command-line tool on local machines. Use when requests mention \"include-what-you-use\" or require workflows supported by this tool."
---

# include-what-you-use

Use this skill to execute **include-what-you-use** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2187 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://include-what-you-use.org/
- **License:** NCSA
- **Catalog description:** Tool to analyze #includes in C and C++ source files
## Procedure
1. Confirm the tool is available.
   - `command -v include-what-you-use`
   - `include-what-you-use --version` (fallback: `include-what-you-use -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search include-what-you-use` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search include-what-you-use` then install the matching package.
   - Fedora/RHEL: `dnf search include-what-you-use` then install the matching package.
3. Inspect supported commands/options.
   - `include-what-you-use --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
