---
name: ddcctl
description: "Run and troubleshoot the ddcctl command-line tool on local machines. Use when requests mention \"ddcctl\" or require workflows supported by this tool."
---

# ddcctl

Use this skill to execute **ddcctl** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2450 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/kfix/ddcctl
- **License:** GPL-3.0-only
- **Catalog description:** DDC monitor controls (brightness) for Mac OSX command-line
## Procedure
1. Confirm the tool is available.
   - `command -v ddcctl`
   - `ddcctl --version` (fallback: `ddcctl -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ddcctl` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ddcctl` then install the matching package.
   - Fedora/RHEL: `dnf search ddcctl` then install the matching package.
3. Inspect supported commands/options.
   - `ddcctl --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
