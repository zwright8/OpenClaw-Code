---
name: serverless
description: "Run and troubleshoot the serverless command-line tool on local machines. Use when requests mention \"serverless\" or require workflows supported by this tool."
---

# serverless

Use this skill to execute **serverless** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2463 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.serverless.com/
- **License:** MIT
- **Catalog description:** Build applications with serverless architectures
## Procedure
1. Confirm the tool is available.
   - `command -v serverless`
   - `serverless --version` (fallback: `serverless -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search serverless` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search serverless` then install the matching package.
   - Fedora/RHEL: `dnf search serverless` then install the matching package.
3. Inspect supported commands/options.
   - `serverless --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
