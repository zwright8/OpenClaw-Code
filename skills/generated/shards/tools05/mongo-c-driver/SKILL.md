---
name: mongo-c-driver
description: "Run and troubleshoot the mongo-c-driver command-line tool on local machines. Use when requests mention \"mongo-c-driver\" or require workflows supported by this tool."
---

# mongo-c-driver

Use this skill to execute **mongo-c-driver** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2298 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/mongodb/mongo-c-driver
- **License:** Apache-2.0
- **Catalog description:** C driver for MongoDB
## Procedure
1. Confirm the tool is available.
   - `command -v mongo-c-driver`
   - `mongo-c-driver --version` (fallback: `mongo-c-driver -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mongo-c-driver` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mongo-c-driver` then install the matching package.
   - Fedora/RHEL: `dnf search mongo-c-driver` then install the matching package.
3. Inspect supported commands/options.
   - `mongo-c-driver --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
