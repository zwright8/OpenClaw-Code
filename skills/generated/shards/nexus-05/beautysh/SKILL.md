---
name: beautysh
description: "Run and troubleshoot the beautysh command-line tool on local machines. Use when requests mention \"beautysh\" or require workflows supported by this tool."
---

# beautysh

Use this skill to execute **beautysh** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2242 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/lovesegfault/beautysh
- **License:** MIT
- **Catalog description:** Bash beautifier
## Procedure
1. Confirm the tool is available.
   - `command -v beautysh`
   - `beautysh --version` (fallback: `beautysh -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search beautysh` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search beautysh` then install the matching package.
   - Fedora/RHEL: `dnf search beautysh` then install the matching package.
3. Inspect supported commands/options.
   - `beautysh --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
