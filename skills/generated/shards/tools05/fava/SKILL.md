---
name: fava
description: "Run and troubleshoot the fava command-line tool on local machines. Use when requests mention \"fava\" or require workflows supported by this tool."
---

# fava

Use this skill to execute **fava** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2312 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://beancount.github.io/fava/
- **License:** MIT
- **Catalog description:** Web interface for the double-entry bookkeeping software Beancount
## Procedure
1. Confirm the tool is available.
   - `command -v fava`
   - `fava --version` (fallback: `fava -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search fava` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search fava` then install the matching package.
   - Fedora/RHEL: `dnf search fava` then install the matching package.
3. Inspect supported commands/options.
   - `fava --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
