---
name: benthos
description: "Run and troubleshoot the benthos command-line tool on local machines. Use when requests mention \"benthos\" or require workflows supported by this tool."
---

# benthos

Use this skill to execute **benthos** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2438 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/redpanda-data/benthos
- **License:** MIT
- **Catalog description:** Stream processor for mundane tasks written in Go
## Procedure
1. Confirm the tool is available.
   - `command -v benthos`
   - `benthos --version` (fallback: `benthos -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search benthos` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search benthos` then install the matching package.
   - Fedora/RHEL: `dnf search benthos` then install the matching package.
3. Inspect supported commands/options.
   - `benthos --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
