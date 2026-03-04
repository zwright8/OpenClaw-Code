---
name: granted
description: "Run and troubleshoot the granted command-line tool on local machines. Use when requests mention \"granted\" or require workflows supported by this tool."
---

# granted

Use this skill to execute **granted** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2044 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://granted.dev/
- **License:** MIT
- **Catalog description:** Easiest way to access your cloud
## Procedure
1. Confirm the tool is available.
   - `command -v granted`
   - `granted --version` (fallback: `granted -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search granted` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search granted` then install the matching package.
   - Fedora/RHEL: `dnf search granted` then install the matching package.
3. Inspect supported commands/options.
   - `granted --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
