---
name: rubyfmt
description: "Run and troubleshoot the rubyfmt command-line tool on local machines. Use when requests mention \"rubyfmt\" or require workflows supported by this tool."
---

# rubyfmt

Use this skill to execute **rubyfmt** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2264 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/fables-tales/rubyfmt
- **License:** MIT
- **Catalog description:** Ruby autoformatter
## Procedure
1. Confirm the tool is available.
   - `command -v rubyfmt`
   - `rubyfmt --version` (fallback: `rubyfmt -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search rubyfmt` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search rubyfmt` then install the matching package.
   - Fedora/RHEL: `dnf search rubyfmt` then install the matching package.
3. Inspect supported commands/options.
   - `rubyfmt --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
