---
name: cfssl
description: "Run and troubleshoot the cfssl command-line tool on local machines. Use when requests mention \"cfssl\" or require workflows supported by this tool."
---

# cfssl

Use this skill to execute **cfssl** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2385 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://cfssl.org/
- **License:** BSD-2-Clause
- **Catalog description:** CloudFlare's PKI toolkit
## Procedure
1. Confirm the tool is available.
   - `command -v cfssl`
   - `cfssl --version` (fallback: `cfssl -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search cfssl` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search cfssl` then install the matching package.
   - Fedora/RHEL: `dnf search cfssl` then install the matching package.
3. Inspect supported commands/options.
   - `cfssl --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
