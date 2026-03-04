---
name: zeroclaw
description: "Run and troubleshoot the zeroclaw command-line tool on local machines. Use when requests mention \"zeroclaw\" or require workflows supported by this tool."
---

# zeroclaw

Use this skill to execute **zeroclaw** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2289 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/zeroclaw-labs/zeroclaw
- **License:** Apache-2.0 OR MIT
- **Catalog description:** Rust-first autonomous agent runtime
## Procedure
1. Confirm the tool is available.
   - `command -v zeroclaw`
   - `zeroclaw --version` (fallback: `zeroclaw -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search zeroclaw` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search zeroclaw` then install the matching package.
   - Fedora/RHEL: `dnf search zeroclaw` then install the matching package.
3. Inspect supported commands/options.
   - `zeroclaw --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
