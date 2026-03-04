---
name: jwt-cli
description: "Run and troubleshoot the jwt-cli command-line tool on local machines. Use when requests mention \"jwt-cli\" or require workflows supported by this tool."
---

# jwt-cli

Use this skill to execute **jwt-cli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2145 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/mike-engel/jwt-cli
- **License:** MIT
- **Catalog description:** Super fast CLI tool to decode and encode JWTs built in Rust
## Procedure
1. Confirm the tool is available.
   - `command -v jwt-cli`
   - `jwt-cli --version` (fallback: `jwt-cli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search jwt-cli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search jwt-cli` then install the matching package.
   - Fedora/RHEL: `dnf search jwt-cli` then install the matching package.
3. Inspect supported commands/options.
   - `jwt-cli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
