---
name: k3sup
description: "Run and troubleshoot the k3sup command-line tool on local machines. Use when requests mention \"k3sup\" or require workflows supported by this tool."
---

# k3sup

Use this skill to execute **k3sup** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2188 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://k3sup.dev
- **License:** MIT
- **Catalog description:** Utility to create k3s clusters on any local or remote VM
## Procedure
1. Confirm the tool is available.
   - `command -v k3sup`
   - `k3sup --version` (fallback: `k3sup -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search k3sup` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search k3sup` then install the matching package.
   - Fedora/RHEL: `dnf search k3sup` then install the matching package.
3. Inspect supported commands/options.
   - `k3sup --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
