---
name: toot
description: "Run and troubleshoot the toot command-line tool on local machines. Use when requests mention \"toot\" or require workflows supported by this tool."
---

# toot

Use this skill to execute **toot** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2464 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://toot.bezdomni.net/
- **License:** GPL-3.0-only
- **Catalog description:** Mastodon CLI & TUI
## Procedure
1. Confirm the tool is available.
   - `command -v toot`
   - `toot --version` (fallback: `toot -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search toot` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search toot` then install the matching package.
   - Fedora/RHEL: `dnf search toot` then install the matching package.
3. Inspect supported commands/options.
   - `toot --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
