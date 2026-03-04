---
name: sfml-2
description: "Run and troubleshoot the sfml@2 command-line tool on local machines. Use when requests mention \"sfml@2\" or require workflows supported by this tool."
---

# sfml@2

Use this skill to execute **sfml@2** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2236 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.sfml-dev.org/
- **License:** Zlib
- **Catalog description:** Multi-media library with bindings for multiple languages
- **Executable hint:** package/catalog name is `sfml@2`, while the runnable binary is often `sfml`.
## Procedure
1. Confirm the tool is available.
   - `command -v sfml`
   - `sfml --version` (fallback: `sfml -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search sfml@2` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search sfml@2` then install the matching package.
   - Fedora/RHEL: `dnf search sfml@2` then install the matching package.
3. Inspect supported commands/options.
   - `sfml --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
