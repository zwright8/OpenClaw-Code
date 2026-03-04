---
name: rbspy
description: "Run and troubleshoot the rbspy command-line tool on local machines. Use when requests mention \"rbspy\" or require workflows supported by this tool."
---

# rbspy

Use this skill to execute **rbspy** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2207 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://rbspy.github.io/
- **License:** MIT
- **Catalog description:** Sampling profiler for Ruby
## Procedure
1. Confirm the tool is available.
   - `command -v rbspy`
   - `rbspy --version` (fallback: `rbspy -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search rbspy` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search rbspy` then install the matching package.
   - Fedora/RHEL: `dnf search rbspy` then install the matching package.
3. Inspect supported commands/options.
   - `rbspy --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
