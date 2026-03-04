---
name: schemathesis
description: "Run and troubleshoot the schemathesis command-line tool on local machines. Use when requests mention \"schemathesis\" or require workflows supported by this tool."
---

# schemathesis

Use this skill to execute **schemathesis** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2318 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://schemathesis.readthedocs.io/
- **License:** MIT
- **Catalog description:** Testing tool for web applications with specs
## Procedure
1. Confirm the tool is available.
   - `command -v schemathesis`
   - `schemathesis --version` (fallback: `schemathesis -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search schemathesis` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search schemathesis` then install the matching package.
   - Fedora/RHEL: `dnf search schemathesis` then install the matching package.
3. Inspect supported commands/options.
   - `schemathesis --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
