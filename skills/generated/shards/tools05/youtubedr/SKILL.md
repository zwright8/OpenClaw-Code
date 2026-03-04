---
name: youtubedr
description: "Run and troubleshoot the youtubedr command-line tool on local machines. Use when requests mention \"youtubedr\" or require workflows supported by this tool."
---

# youtubedr

Use this skill to execute **youtubedr** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2381 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/kkdai/youtube
- **License:** MIT
- **Catalog description:** Download Youtube Video in Golang
## Procedure
1. Confirm the tool is available.
   - `command -v youtubedr`
   - `youtubedr --version` (fallback: `youtubedr -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search youtubedr` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search youtubedr` then install the matching package.
   - Fedora/RHEL: `dnf search youtubedr` then install the matching package.
3. Inspect supported commands/options.
   - `youtubedr --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
