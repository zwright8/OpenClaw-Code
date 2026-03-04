---
name: micronaut
description: "Run and troubleshoot the micronaut command-line tool on local machines. Use when requests mention \"micronaut\" or require workflows supported by this tool."
---

# micronaut

Use this skill to execute **micronaut** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2352 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://micronaut.io/
- **License:** Apache-2.0
- **Catalog description:** Modern JVM-based framework for building modular microservices
## Procedure
1. Confirm the tool is available.
   - `command -v micronaut`
   - `micronaut --version` (fallback: `micronaut -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search micronaut` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search micronaut` then install the matching package.
   - Fedora/RHEL: `dnf search micronaut` then install the matching package.
3. Inspect supported commands/options.
   - `micronaut --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
