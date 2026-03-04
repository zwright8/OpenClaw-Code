---
name: virtctl
description: "Run and troubleshoot the virtctl command-line tool on local machines. Use when requests mention \"virtctl\" or require workflows supported by this tool."
---

# virtctl

Use this skill to execute **virtctl** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2179 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://kubevirt.io/
- **License:** Apache-2.0
- **Catalog description:** Allows for using more advanced kubevirt features
## Procedure
1. Confirm the tool is available.
   - `command -v virtctl`
   - `virtctl --version` (fallback: `virtctl -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search virtctl` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search virtctl` then install the matching package.
   - Fedora/RHEL: `dnf search virtctl` then install the matching package.
3. Inspect supported commands/options.
   - `virtctl --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
