---
name: worktrunk
description: "Run and troubleshoot the worktrunk command-line tool on local machines. Use when requests mention \"worktrunk\" or require workflows supported by this tool."
---

# worktrunk

Use this skill to execute **worktrunk** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2255 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://worktrunk.dev
- **License:** Apache-2.0 OR MIT
- **Catalog description:** CLI for Git worktree management, designed for parallel AI agent workflows
## Procedure
1. Confirm the tool is available.
   - `command -v worktrunk`
   - `worktrunk --version` (fallback: `worktrunk -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search worktrunk` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search worktrunk` then install the matching package.
   - Fedora/RHEL: `dnf search worktrunk` then install the matching package.
3. Inspect supported commands/options.
   - `worktrunk --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
