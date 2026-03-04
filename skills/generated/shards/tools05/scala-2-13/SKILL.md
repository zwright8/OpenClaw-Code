---
name: scala-2-13
description: "Run and troubleshoot the scala@2.13 command-line tool on local machines. Use when requests mention \"scala@2.13\" or require workflows supported by this tool."
---

# scala@2.13

Use this skill to execute **scala@2.13** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2473 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.scala-lang.org/
- **License:** Apache-2.0
- **Catalog description:** JVM-based programming language
- **Executable hint:** package/catalog name is `scala@2.13`, while the runnable binary is often `scala`.
## Procedure
1. Confirm the tool is available.
   - `command -v scala`
   - `scala --version` (fallback: `scala -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search scala@2.13` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search scala@2.13` then install the matching package.
   - Fedora/RHEL: `dnf search scala@2.13` then install the matching package.
3. Inspect supported commands/options.
   - `scala --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
