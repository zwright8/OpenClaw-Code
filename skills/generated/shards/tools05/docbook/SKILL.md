---
name: docbook
description: "Run and troubleshoot the docbook command-line tool on local machines. Use when requests mention \"docbook\" or require workflows supported by this tool."
---

# docbook

Use this skill to execute **docbook** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2093 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://docbook.org/
- **License:** LicenseRef-Homebrew-cannot-represent
- **Catalog description:** Standard XML representation system for technical documents
## Procedure
1. Confirm the tool is available.
   - `command -v docbook`
   - `docbook --version` (fallback: `docbook -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search docbook` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search docbook` then install the matching package.
   - Fedora/RHEL: `dnf search docbook` then install the matching package.
3. Inspect supported commands/options.
   - `docbook --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
