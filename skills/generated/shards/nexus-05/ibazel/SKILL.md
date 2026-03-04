---
name: ibazel
description: "Run and troubleshoot the ibazel command-line tool on local machines. Use when requests mention \"ibazel\" or require workflows supported by this tool."
---

# ibazel

Use this skill to execute **ibazel** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2106 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/bazelbuild/bazel-watcher
- **License:** Apache-2.0
- **Catalog description:** Tools for building Bazel targets when source files change
## Procedure
1. Confirm the tool is available.
   - `command -v ibazel`
   - `ibazel --version` (fallback: `ibazel -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ibazel` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ibazel` then install the matching package.
   - Fedora/RHEL: `dnf search ibazel` then install the matching package.
3. Inspect supported commands/options.
   - `ibazel --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
