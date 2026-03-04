---
name: tmate
description: "Run and troubleshoot the tmate command-line tool on local machines. Use when requests mention \"tmate\" or require workflows supported by this tool."
---

# tmate

Use this skill to execute **tmate** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2481 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://tmate.io/
- **License:** ISC
- **Catalog description:** Instant terminal sharing
## Procedure
1. Confirm the tool is available.
   - `command -v tmate`
   - `tmate --version` (fallback: `tmate -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search tmate` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search tmate` then install the matching package.
   - Fedora/RHEL: `dnf search tmate` then install the matching package.
3. Inspect supported commands/options.
   - `tmate --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
