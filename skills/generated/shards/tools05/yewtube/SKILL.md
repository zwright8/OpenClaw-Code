---
name: yewtube
description: "Run and troubleshoot the yewtube command-line tool on local machines. Use when requests mention \"yewtube\" or require workflows supported by this tool."
---

# yewtube

Use this skill to execute **yewtube** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2395 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/mps-youtube/yewtube
- **License:** GPL-3.0-or-later
- **Catalog description:** Terminal based YouTube player and downloader
## Procedure
1. Confirm the tool is available.
   - `command -v yewtube`
   - `yewtube --version` (fallback: `yewtube -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search yewtube` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search yewtube` then install the matching package.
   - Fedora/RHEL: `dnf search yewtube` then install the matching package.
3. Inspect supported commands/options.
   - `yewtube --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
