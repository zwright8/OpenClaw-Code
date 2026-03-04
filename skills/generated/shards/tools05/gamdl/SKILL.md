---
name: gamdl
description: "Run and troubleshoot the gamdl command-line tool on local machines. Use when requests mention \"gamdl\" or require workflows supported by this tool."
---

# gamdl

Use this skill to execute **gamdl** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2398 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/glomatico/gamdl
- **License:** MIT
- **Catalog description:** Python CLI app for downloading Apple Music songs, music videos and post videos
## Procedure
1. Confirm the tool is available.
   - `command -v gamdl`
   - `gamdl --version` (fallback: `gamdl -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gamdl` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gamdl` then install the matching package.
   - Fedora/RHEL: `dnf search gamdl` then install the matching package.
3. Inspect supported commands/options.
   - `gamdl --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
