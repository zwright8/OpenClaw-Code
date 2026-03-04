---
name: dex2jar
description: "Run and troubleshoot the dex2jar command-line tool on local machines. Use when requests mention \"dex2jar\" or require workflows supported by this tool."
---

# dex2jar

Use this skill to execute **dex2jar** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2201 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/pxb1988/dex2jar
- **License:** Apache-2.0
- **Catalog description:** Tools to work with Android .dex and Java .class files
## Procedure
1. Confirm the tool is available.
   - `command -v dex2jar`
   - `dex2jar --version` (fallback: `dex2jar -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search dex2jar` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search dex2jar` then install the matching package.
   - Fedora/RHEL: `dnf search dex2jar` then install the matching package.
3. Inspect supported commands/options.
   - `dex2jar --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
