---
name: katago
description: "Run and troubleshoot the katago command-line tool on local machines. Use when requests mention \"katago\" or require workflows supported by this tool."
---

# katago

Use this skill to execute **katago** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2127 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/lightvector/KataGo
- **License:** MIT AND CC0-1.0
- **Catalog description:** Neural Network Go engine with no human-provided knowledge
## Procedure
1. Confirm the tool is available.
   - `command -v katago`
   - `katago --version` (fallback: `katago -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search katago` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search katago` then install the matching package.
   - Fedora/RHEL: `dnf search katago` then install the matching package.
3. Inspect supported commands/options.
   - `katago --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
