---
name: nerdfetch
description: "Run and troubleshoot the nerdfetch command-line tool on local machines. Use when requests mention \"nerdfetch\" or require workflows supported by this tool."
---

# nerdfetch

Use this skill to execute **nerdfetch** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2108 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/ThatOneCalculator/NerdFetch
- **License:** MIT
- **Catalog description:** POSIX *nix fetch script using Nerdfonts
## Procedure
1. Confirm the tool is available.
   - `command -v nerdfetch`
   - `nerdfetch --version` (fallback: `nerdfetch -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search nerdfetch` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search nerdfetch` then install the matching package.
   - Fedora/RHEL: `dnf search nerdfetch` then install the matching package.
3. Inspect supported commands/options.
   - `nerdfetch --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
