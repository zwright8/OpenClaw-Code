---
name: protolint
description: "Run and troubleshoot the protolint command-line tool on local machines. Use when requests mention \"protolint\" or require workflows supported by this tool."
---

# protolint

Use this skill to execute **protolint** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2163 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/yoheimuta/protolint
- **License:** MIT
- **Catalog description:** Pluggable linter and fixer to enforce Protocol Buffer style and conventions
## Procedure
1. Confirm the tool is available.
   - `command -v protolint`
   - `protolint --version` (fallback: `protolint -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search protolint` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search protolint` then install the matching package.
   - Fedora/RHEL: `dnf search protolint` then install the matching package.
3. Inspect supported commands/options.
   - `protolint --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
