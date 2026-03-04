---
name: kube-score
description: "Run and troubleshoot the kube-score command-line tool on local machines. Use when requests mention \"kube-score\" or require workflows supported by this tool."
---

# kube-score

Use this skill to execute **kube-score** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2396 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://kube-score.com
- **License:** MIT
- **Catalog description:** Kubernetes object analysis recommendations for improved reliability and security
## Procedure
1. Confirm the tool is available.
   - `command -v kube-score`
   - `kube-score --version` (fallback: `kube-score -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search kube-score` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search kube-score` then install the matching package.
   - Fedora/RHEL: `dnf search kube-score` then install the matching package.
3. Inspect supported commands/options.
   - `kube-score --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
