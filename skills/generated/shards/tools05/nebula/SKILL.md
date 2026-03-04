---
name: nebula
description: "Run and troubleshoot the nebula command-line tool on local machines. Use when requests mention \"nebula\" or require workflows supported by this tool."
---

# nebula

Use this skill to execute **nebula** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2205 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/slackhq/nebula
- **License:** MIT
- **Catalog description:** Scalable overlay networking tool for connecting computers anywhere
## Procedure
1. Confirm the tool is available.
   - `command -v nebula`
   - `nebula --version` (fallback: `nebula -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search nebula` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search nebula` then install the matching package.
   - Fedora/RHEL: `dnf search nebula` then install the matching package.
3. Inspect supported commands/options.
   - `nebula --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
