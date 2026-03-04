---
name: tfupdate
description: "Run and troubleshoot the tfupdate command-line tool on local machines. Use when requests mention \"tfupdate\" or require workflows supported by this tool."
---

# tfupdate

Use this skill to execute **tfupdate** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2041 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/minamijoyo/tfupdate
- **License:** MIT
- **Catalog description:** Update version constraints in your Terraform configurations
## Procedure
1. Confirm the tool is available.
   - `command -v tfupdate`
   - `tfupdate --version` (fallback: `tfupdate -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search tfupdate` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search tfupdate` then install the matching package.
   - Fedora/RHEL: `dnf search tfupdate` then install the matching package.
3. Inspect supported commands/options.
   - `tfupdate --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
