---
name: rke
description: "Run and troubleshoot the rke command-line tool on local machines. Use when requests mention \"rke\" or require workflows supported by this tool."
---

# rke

Use this skill to execute **rke** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2345 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://rke.docs.rancher.com/
- **License:** Apache-2.0
- **Catalog description:** Rancher Kubernetes Engine, a Kubernetes installer that works everywhere
## Procedure
1. Confirm the tool is available.
   - `command -v rke`
   - `rke --version` (fallback: `rke -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search rke` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search rke` then install the matching package.
   - Fedora/RHEL: `dnf search rke` then install the matching package.
3. Inspect supported commands/options.
   - `rke --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
