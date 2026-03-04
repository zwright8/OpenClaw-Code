---
name: wgcf
description: "Run and troubleshoot the wgcf command-line tool on local machines. Use when requests mention \"wgcf\" or require workflows supported by this tool."
---

# wgcf

Use this skill to execute **wgcf** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2303 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/ViRb3/wgcf
- **License:** MIT
- **Catalog description:** Generate WireGuard profile from Cloudflare Warp account
## Procedure
1. Confirm the tool is available.
   - `command -v wgcf`
   - `wgcf --version` (fallback: `wgcf -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search wgcf` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search wgcf` then install the matching package.
   - Fedora/RHEL: `dnf search wgcf` then install the matching package.
3. Inspect supported commands/options.
   - `wgcf --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
