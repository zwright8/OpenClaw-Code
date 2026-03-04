---
name: foremost
description: "Run and troubleshoot the foremost command-line tool on local machines. Use when requests mention \"foremost\" or require workflows supported by this tool."
---

# foremost

Use this skill to execute **foremost** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2267 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://foremost.sourceforge.net/
- **License:** LicenseRef-Homebrew-public-domain
- **Catalog description:** Console program to recover files based on their headers and footers
## Procedure
1. Confirm the tool is available.
   - `command -v foremost`
   - `foremost --version` (fallback: `foremost -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search foremost` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search foremost` then install the matching package.
   - Fedora/RHEL: `dnf search foremost` then install the matching package.
3. Inspect supported commands/options.
   - `foremost --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
