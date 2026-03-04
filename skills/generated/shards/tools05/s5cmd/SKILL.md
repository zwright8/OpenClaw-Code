---
name: s5cmd
description: "Run and troubleshoot the s5cmd command-line tool on local machines. Use when requests mention \"s5cmd\" or require workflows supported by this tool."
---

# s5cmd

Use this skill to execute **s5cmd** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2483 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/peak/s5cmd/
- **License:** MIT
- **Catalog description:** Parallel S3 and local filesystem execution tool
## Procedure
1. Confirm the tool is available.
   - `command -v s5cmd`
   - `s5cmd --version` (fallback: `s5cmd -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search s5cmd` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search s5cmd` then install the matching package.
   - Fedora/RHEL: `dnf search s5cmd` then install the matching package.
3. Inspect supported commands/options.
   - `s5cmd --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
