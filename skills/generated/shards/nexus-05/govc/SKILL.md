---
name: govc
description: "Run and troubleshoot the govc command-line tool on local machines. Use when requests mention \"govc\" or require workflows supported by this tool."
---

# govc

Use this skill to execute **govc** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2113 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/vmware/govmomi/tree/main/govc
- **License:** Apache-2.0
- **Catalog description:** Command-line tool for VMware vSphere
## Procedure
1. Confirm the tool is available.
   - `command -v govc`
   - `govc --version` (fallback: `govc -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search govc` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search govc` then install the matching package.
   - Fedora/RHEL: `dnf search govc` then install the matching package.
3. Inspect supported commands/options.
   - `govc --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
