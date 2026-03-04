---
name: dyff
description: "Run and troubleshoot the dyff command-line tool on local machines. Use when requests mention \"dyff\" or require workflows supported by this tool."
---

# dyff

Use this skill to execute **dyff** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2046 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/homeport/dyff
- **License:** MIT
- **Catalog description:** Diff tool for YAML files, and sometimes JSON
## Procedure
1. Confirm the tool is available.
   - `command -v dyff`
   - `dyff --version` (fallback: `dyff -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search dyff` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search dyff` then install the matching package.
   - Fedora/RHEL: `dnf search dyff` then install the matching package.
3. Inspect supported commands/options.
   - `dyff --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
