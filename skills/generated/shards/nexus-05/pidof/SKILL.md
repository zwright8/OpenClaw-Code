---
name: pidof
description: "Run and troubleshoot the pidof command-line tool on local machines. Use when requests mention \"pidof\" or require workflows supported by this tool."
---

# pidof

Use this skill to execute **pidof** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2173 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://web.archive.org/web/20240808152721/http://www.nightproductions.net/cli.htm
- **License:** LicenseRef-Homebrew-cannot-represent
- **Catalog description:** Display the PID number for a given process name
## Procedure
1. Confirm the tool is available.
   - `command -v pidof`
   - `pidof --version` (fallback: `pidof -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search pidof` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search pidof` then install the matching package.
   - Fedora/RHEL: `dnf search pidof` then install the matching package.
3. Inspect supported commands/options.
   - `pidof --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
