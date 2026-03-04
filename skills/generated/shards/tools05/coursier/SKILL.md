---
name: coursier
description: "Run and troubleshoot the coursier command-line tool on local machines. Use when requests mention \"coursier\" or require workflows supported by this tool."
---

# coursier

Use this skill to execute **coursier** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2151 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://get-coursier.io/
- **License:** Apache-2.0
- **Catalog description:** Pure Scala Artifact Fetching
## Procedure
1. Confirm the tool is available.
   - `command -v coursier`
   - `coursier --version` (fallback: `coursier -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search coursier` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search coursier` then install the matching package.
   - Fedora/RHEL: `dnf search coursier` then install the matching package.
3. Inspect supported commands/options.
   - `coursier --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
