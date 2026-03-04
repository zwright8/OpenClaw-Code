---
name: needle
description: "Run and troubleshoot the needle command-line tool on local machines. Use when requests mention \"needle\" or require workflows supported by this tool."
---

# needle

Use this skill to execute **needle** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2306 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/uber/needle
- **License:** Apache-2.0
- **Catalog description:** Compile-time safe Swift dependency injection framework with real code
## Procedure
1. Confirm the tool is available.
   - `command -v needle`
   - `needle --version` (fallback: `needle -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search needle` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search needle` then install the matching package.
   - Fedora/RHEL: `dnf search needle` then install the matching package.
3. Inspect supported commands/options.
   - `needle --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
