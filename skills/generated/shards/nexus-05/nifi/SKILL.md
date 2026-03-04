---
name: nifi
description: "Run and troubleshoot the nifi command-line tool on local machines. Use when requests mention \"nifi\" or require workflows supported by this tool."
---

# nifi

Use this skill to execute **nifi** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2399 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://nifi.apache.org
- **License:** Apache-2.0
- **Catalog description:** Easy to use, powerful, and reliable system to process and distribute data
## Procedure
1. Confirm the tool is available.
   - `command -v nifi`
   - `nifi --version` (fallback: `nifi -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search nifi` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search nifi` then install the matching package.
   - Fedora/RHEL: `dnf search nifi` then install the matching package.
3. Inspect supported commands/options.
   - `nifi --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
