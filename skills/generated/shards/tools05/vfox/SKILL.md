---
name: vfox
description: "Run and troubleshoot the vfox command-line tool on local machines. Use when requests mention \"vfox\" or require workflows supported by this tool."
---

# vfox

Use this skill to execute **vfox** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2302 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://vfox.dev/
- **License:** Apache-2.0
- **Catalog description:** Version manager with support for Java, Node.js, Flutter, .NET & more
## Procedure
1. Confirm the tool is available.
   - `command -v vfox`
   - `vfox --version` (fallback: `vfox -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search vfox` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search vfox` then install the matching package.
   - Fedora/RHEL: `dnf search vfox` then install the matching package.
3. Inspect supported commands/options.
   - `vfox --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
