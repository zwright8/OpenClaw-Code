---
name: mill
description: "Run and troubleshoot the mill command-line tool on local machines. Use when requests mention \"mill\" or require workflows supported by this tool."
---

# mill

Use this skill to execute **mill** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2466 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://mill-build.org/
- **License:** MIT
- **Catalog description:** Fast, scalable JVM build tool
## Procedure
1. Confirm the tool is available.
   - `command -v mill`
   - `mill --version` (fallback: `mill -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mill` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mill` then install the matching package.
   - Fedora/RHEL: `dnf search mill` then install the matching package.
3. Inspect supported commands/options.
   - `mill --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
