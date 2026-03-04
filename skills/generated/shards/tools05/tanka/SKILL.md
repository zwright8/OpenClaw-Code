---
name: tanka
description: "Run and troubleshoot the tanka command-line tool on local machines. Use when requests mention \"tanka\" or require workflows supported by this tool."
---

# tanka

Use this skill to execute **tanka** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2320 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://tanka.dev
- **License:** Apache-2.0
- **Catalog description:** Flexible, reusable and concise configuration for Kubernetes using Jsonnet
## Procedure
1. Confirm the tool is available.
   - `command -v tanka`
   - `tanka --version` (fallback: `tanka -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search tanka` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search tanka` then install the matching package.
   - Fedora/RHEL: `dnf search tanka` then install the matching package.
3. Inspect supported commands/options.
   - `tanka --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
