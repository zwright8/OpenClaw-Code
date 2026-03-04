---
name: werf
description: "Run and troubleshoot the werf command-line tool on local machines. Use when requests mention \"werf\" or require workflows supported by this tool."
---

# werf

Use this skill to execute **werf** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2157 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://werf.io/
- **License:** Apache-2.0
- **Catalog description:** Consistent delivery tool for Kubernetes
## Procedure
1. Confirm the tool is available.
   - `command -v werf`
   - `werf --version` (fallback: `werf -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search werf` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search werf` then install the matching package.
   - Fedora/RHEL: `dnf search werf` then install the matching package.
3. Inspect supported commands/options.
   - `werf --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
