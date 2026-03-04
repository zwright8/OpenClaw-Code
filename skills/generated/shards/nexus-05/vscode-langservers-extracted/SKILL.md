---
name: vscode-langservers-extracted
description: "Run and troubleshoot the vscode-langservers-extracted command-line tool on local machines. Use when requests mention \"vscode-langservers-extracted\" or require workflows supported by this tool."
---

# vscode-langservers-extracted

Use this skill to execute **vscode-langservers-extracted** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2053 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/hrsh7th/vscode-langservers-extracted
- **License:** MIT
- **Catalog description:** Language servers for HTML, CSS, JavaScript, and JSON extracted from vscode
## Procedure
1. Confirm the tool is available.
   - `command -v vscode-langservers-extracted`
   - `vscode-langservers-extracted --version` (fallback: `vscode-langservers-extracted -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search vscode-langservers-extracted` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search vscode-langservers-extracted` then install the matching package.
   - Fedora/RHEL: `dnf search vscode-langservers-extracted` then install the matching package.
3. Inspect supported commands/options.
   - `vscode-langservers-extracted --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
