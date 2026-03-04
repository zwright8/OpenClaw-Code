---
name: docbook-xsl
description: "Run and troubleshoot the docbook-xsl command-line tool on local machines. Use when requests mention \"docbook-xsl\" or require workflows supported by this tool."
---

# docbook-xsl

Use this skill to execute **docbook-xsl** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2029 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/docbook/xslt10-stylesheets
- **License:** MIT
- **Catalog description:** XML vocabulary to create presentation-neutral documents
## Procedure
1. Confirm the tool is available.
   - `command -v docbook-xsl`
   - `docbook-xsl --version` (fallback: `docbook-xsl -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search docbook-xsl` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search docbook-xsl` then install the matching package.
   - Fedora/RHEL: `dnf search docbook-xsl` then install the matching package.
3. Inspect supported commands/options.
   - `docbook-xsl --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
