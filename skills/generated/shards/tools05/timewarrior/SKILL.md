---
name: timewarrior
description: "Run and troubleshoot the timewarrior command-line tool on local machines. Use when requests mention \"timewarrior\" or require workflows supported by this tool."
---

# timewarrior

Use this skill to execute **timewarrior** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2300 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://timewarrior.net/
- **License:** MIT
- **Catalog description:** Command-line time tracking application
## Procedure
1. Confirm the tool is available.
   - `command -v timewarrior`
   - `timewarrior --version` (fallback: `timewarrior -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search timewarrior` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search timewarrior` then install the matching package.
   - Fedora/RHEL: `dnf search timewarrior` then install the matching package.
3. Inspect supported commands/options.
   - `timewarrior --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
