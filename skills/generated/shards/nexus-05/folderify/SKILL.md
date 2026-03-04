---
name: folderify
description: "Run and troubleshoot the folderify command-line tool on local machines. Use when requests mention \"folderify\" or require workflows supported by this tool."
---

# folderify

Use this skill to execute **folderify** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2140 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/lgarron/folderify
- **License:** MIT
- **Catalog description:** Generate pixel-perfect macOS folder icons in the native style
## Procedure
1. Confirm the tool is available.
   - `command -v folderify`
   - `folderify --version` (fallback: `folderify -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search folderify` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search folderify` then install the matching package.
   - Fedora/RHEL: `dnf search folderify` then install the matching package.
3. Inspect supported commands/options.
   - `folderify --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
