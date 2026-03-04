---
name: eye-d3
description: "Run and troubleshoot the eye-d3 command-line tool on local machines. Use when requests mention \"eye-d3\" or require workflows supported by this tool."
---

# eye-d3

Use this skill to execute **eye-d3** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2195 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://eyed3.readthedocs.io/en/latest/
- **License:** GPL-3.0-or-later
- **Catalog description:** Work with ID3 metadata in .mp3 files
## Procedure
1. Confirm the tool is available.
   - `command -v eye-d3`
   - `eye-d3 --version` (fallback: `eye-d3 -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search eye-d3` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search eye-d3` then install the matching package.
   - Fedora/RHEL: `dnf search eye-d3` then install the matching package.
3. Inspect supported commands/options.
   - `eye-d3 --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
