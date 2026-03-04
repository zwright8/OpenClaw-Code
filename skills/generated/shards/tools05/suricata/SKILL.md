---
name: suricata
description: "Run and troubleshoot the suricata command-line tool on local machines. Use when requests mention \"suricata\" or require workflows supported by this tool."
---

# suricata

Use this skill to execute **suricata** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2273 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://suricata.io
- **License:** GPL-2.0-only
- **Catalog description:** Network IDS, IPS, and security monitoring engine
## Procedure
1. Confirm the tool is available.
   - `command -v suricata`
   - `suricata --version` (fallback: `suricata -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search suricata` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search suricata` then install the matching package.
   - Fedora/RHEL: `dnf search suricata` then install the matching package.
3. Inspect supported commands/options.
   - `suricata --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
