---
name: arkade
description: "Run and troubleshoot the arkade command-line tool on local machines. Use when requests mention \"arkade\" or require workflows supported by this tool."
---

# arkade

Use this skill to execute **arkade** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2369 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://blog.alexellis.io/kubernetes-marketplace-two-year-update/
- **License:** MIT
- **Catalog description:** Open Source Kubernetes Marketplace
## Procedure
1. Confirm the tool is available.
   - `command -v arkade`
   - `arkade --version` (fallback: `arkade -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search arkade` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search arkade` then install the matching package.
   - Fedora/RHEL: `dnf search arkade` then install the matching package.
3. Inspect supported commands/options.
   - `arkade --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
