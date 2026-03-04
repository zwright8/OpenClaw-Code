---
name: ngspice
description: "Run and troubleshoot the ngspice command-line tool on local machines. Use when requests mention \"ngspice\" or require workflows supported by this tool."
---

# ngspice

Use this skill to execute **ngspice** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2199 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://ngspice.sourceforge.io/
- **License:** LicenseRef-Homebrew-cannot-represent
- **Catalog description:** Spice circuit simulator
## Procedure
1. Confirm the tool is available.
   - `command -v ngspice`
   - `ngspice --version` (fallback: `ngspice -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ngspice` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ngspice` then install the matching package.
   - Fedora/RHEL: `dnf search ngspice` then install the matching package.
3. Inspect supported commands/options.
   - `ngspice --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
