---
name: cyrus-sasl
description: "Run and troubleshoot the cyrus-sasl command-line tool on local machines. Use when requests mention \"cyrus-sasl\" or require workflows supported by this tool."
---

# cyrus-sasl

Use this skill to execute **cyrus-sasl** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2377 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.cyrusimap.org/sasl/
- **License:** BSD-3-Clause-Attribution
- **Catalog description:** Simple Authentication and Security Layer
## Procedure
1. Confirm the tool is available.
   - `command -v cyrus-sasl`
   - `cyrus-sasl --version` (fallback: `cyrus-sasl -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search cyrus-sasl` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search cyrus-sasl` then install the matching package.
   - Fedora/RHEL: `dnf search cyrus-sasl` then install the matching package.
3. Inspect supported commands/options.
   - `cyrus-sasl --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
