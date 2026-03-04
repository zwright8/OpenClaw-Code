---
name: sponge
description: "Run and troubleshoot the sponge command-line tool on local machines. Use when requests mention \"sponge\" or require workflows supported by this tool."
---

# sponge

Use this skill to execute **sponge** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2233 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://joeyh.name/code/moreutils/
- **License:** GPL-2.0-only
- **Catalog description:** Soak up standard input and write to a file
## Procedure
1. Confirm the tool is available.
   - `command -v sponge`
   - `sponge --version` (fallback: `sponge -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search sponge` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search sponge` then install the matching package.
   - Fedora/RHEL: `dnf search sponge` then install the matching package.
3. Inspect supported commands/options.
   - `sponge --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
