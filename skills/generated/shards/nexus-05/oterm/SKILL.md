---
name: oterm
description: "Run and troubleshoot the oterm command-line tool on local machines. Use when requests mention \"oterm\" or require workflows supported by this tool."
---

# oterm

Use this skill to execute **oterm** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2285 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/ggozad/oterm
- **License:** MIT
- **Catalog description:** Terminal client for Ollama
## Procedure
1. Confirm the tool is available.
   - `command -v oterm`
   - `oterm --version` (fallback: `oterm -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search oterm` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search oterm` then install the matching package.
   - Fedora/RHEL: `dnf search oterm` then install the matching package.
3. Inspect supported commands/options.
   - `oterm --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
