---
name: ipopt
description: "Run and troubleshoot the ipopt command-line tool on local machines. Use when requests mention \"ipopt\" or require workflows supported by this tool."
---

# ipopt

Use this skill to execute **ipopt** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2006 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://coin-or.github.io/Ipopt/
- **License:** EPL-2.0
- **Catalog description:** Interior point optimizer
## Procedure
1. Confirm the tool is available.
   - `command -v ipopt`
   - `ipopt --version` (fallback: `ipopt -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ipopt` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ipopt` then install the matching package.
   - Fedora/RHEL: `dnf search ipopt` then install the matching package.
3. Inspect supported commands/options.
   - `ipopt --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
