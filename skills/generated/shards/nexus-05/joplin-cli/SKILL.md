---
name: joplin-cli
description: "Run and troubleshoot the joplin-cli command-line tool on local machines. Use when requests mention \"joplin-cli\" or require workflows supported by this tool."
---

# joplin-cli

Use this skill to execute **joplin-cli** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2429 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://joplinapp.org/
- **License:** MIT
- **Catalog description:** Note taking and to-do application with synchronization capabilities
## Procedure
1. Confirm the tool is available.
   - `command -v joplin-cli`
   - `joplin-cli --version` (fallback: `joplin-cli -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search joplin-cli` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search joplin-cli` then install the matching package.
   - Fedora/RHEL: `dnf search joplin-cli` then install the matching package.
3. Inspect supported commands/options.
   - `joplin-cli --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
