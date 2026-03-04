---
name: bandit
description: "Run and troubleshoot the bandit command-line tool on local machines. Use when requests mention \"bandit\" or require workflows supported by this tool."
---

# bandit

Use this skill to execute **bandit** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2269 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/PyCQA/bandit
- **License:** Apache-2.0
- **Catalog description:** Security-oriented static analyser for Python code
## Procedure
1. Confirm the tool is available.
   - `command -v bandit`
   - `bandit --version` (fallback: `bandit -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search bandit` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search bandit` then install the matching package.
   - Fedora/RHEL: `dnf search bandit` then install the matching package.
3. Inspect supported commands/options.
   - `bandit --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
