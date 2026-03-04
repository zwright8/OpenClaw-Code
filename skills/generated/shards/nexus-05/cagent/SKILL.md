---
name: cagent
description: "Run and troubleshoot the cagent command-line tool on local machines. Use when requests mention \"cagent\" or require workflows supported by this tool."
---

# cagent

Use this skill to execute **cagent** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2063 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/docker/cagent
- **License:** Apache-2.0
- **Catalog description:** Agent Builder and Runtime by Docker Engineering
## Procedure
1. Confirm the tool is available.
   - `command -v cagent`
   - `cagent --version` (fallback: `cagent -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search cagent` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search cagent` then install the matching package.
   - Fedora/RHEL: `dnf search cagent` then install the matching package.
3. Inspect supported commands/options.
   - `cagent --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
