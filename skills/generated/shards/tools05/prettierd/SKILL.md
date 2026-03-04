---
name: prettierd
description: "Run and troubleshoot the prettierd command-line tool on local machines. Use when requests mention \"prettierd\" or require workflows supported by this tool."
---

# prettierd

Use this skill to execute **prettierd** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2351 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/fsouza/prettierd
- **License:** ISC
- **Catalog description:** Prettier daemon
## Procedure
1. Confirm the tool is available.
   - `command -v prettierd`
   - `prettierd --version` (fallback: `prettierd -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search prettierd` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search prettierd` then install the matching package.
   - Fedora/RHEL: `dnf search prettierd` then install the matching package.
3. Inspect supported commands/options.
   - `prettierd --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
