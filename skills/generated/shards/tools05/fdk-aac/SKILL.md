---
name: fdk-aac
description: "Run and troubleshoot the fdk-aac command-line tool on local machines. Use when requests mention \"fdk-aac\" or require workflows supported by this tool."
---

# fdk-aac

Use this skill to execute **fdk-aac** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2363 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://sourceforge.net/projects/opencore-amr/
- **License:** Apache-2.0
- **Catalog description:** Standalone library of the Fraunhofer FDK AAC code from Android
## Procedure
1. Confirm the tool is available.
   - `command -v fdk-aac`
   - `fdk-aac --version` (fallback: `fdk-aac -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search fdk-aac` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search fdk-aac` then install the matching package.
   - Fedora/RHEL: `dnf search fdk-aac` then install the matching package.
3. Inspect supported commands/options.
   - `fdk-aac --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
