---
name: stress
description: "Run and troubleshoot the stress command-line tool on local machines. Use when requests mention \"stress\" or require workflows supported by this tool."
---

# stress

Use this skill to execute **stress** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2085 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/resurrecting-open-source-projects/stress
- **License:** GPL-2.0-or-later
- **Catalog description:** Tool to impose load on and stress test a computer system
## Procedure
1. Confirm the tool is available.
   - `command -v stress`
   - `stress --version` (fallback: `stress -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search stress` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search stress` then install the matching package.
   - Fedora/RHEL: `dnf search stress` then install the matching package.
3. Inspect supported commands/options.
   - `stress --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
