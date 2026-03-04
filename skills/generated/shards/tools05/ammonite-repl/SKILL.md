---
name: ammonite-repl
description: "Run and troubleshoot the ammonite-repl command-line tool on local machines. Use when requests mention \"ammonite-repl\" or require workflows supported by this tool."
---

# ammonite-repl

Use this skill to execute **ammonite-repl** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2401 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://ammonite.io/
- **License:** MIT
- **Catalog description:** Ammonite is a cleanroom re-implementation of the Scala REPL
## Procedure
1. Confirm the tool is available.
   - `command -v ammonite-repl`
   - `ammonite-repl --version` (fallback: `ammonite-repl -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ammonite-repl` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ammonite-repl` then install the matching package.
   - Fedora/RHEL: `dnf search ammonite-repl` then install the matching package.
3. Inspect supported commands/options.
   - `ammonite-repl --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
