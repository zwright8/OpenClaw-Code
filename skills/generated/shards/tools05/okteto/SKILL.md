---
name: okteto
description: "Run and troubleshoot the okteto command-line tool on local machines. Use when requests mention \"okteto\" or require workflows supported by this tool."
---

# okteto

Use this skill to execute **okteto** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2002 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://okteto.com
- **License:** Apache-2.0
- **Catalog description:** Build better apps by developing and testing code directly in Kubernetes
## Procedure
1. Confirm the tool is available.
   - `command -v okteto`
   - `okteto --version` (fallback: `okteto -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search okteto` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search okteto` then install the matching package.
   - Fedora/RHEL: `dnf search okteto` then install the matching package.
3. Inspect supported commands/options.
   - `okteto --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
