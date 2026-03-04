---
name: groovysdk
description: "Run and troubleshoot the groovysdk command-line tool on local machines. Use when requests mention \"groovysdk\" or require workflows supported by this tool."
---

# groovysdk

Use this skill to execute **groovysdk** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2331 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.groovy-lang.org/
- **License:** Apache-2.0
- **Catalog description:** SDK for Groovy: a Java-based scripting language
## Procedure
1. Confirm the tool is available.
   - `command -v groovysdk`
   - `groovysdk --version` (fallback: `groovysdk -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search groovysdk` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search groovysdk` then install the matching package.
   - Fedora/RHEL: `dnf search groovysdk` then install the matching package.
3. Inspect supported commands/options.
   - `groovysdk --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
