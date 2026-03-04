---
name: kubent
description: "Run and troubleshoot the kubent command-line tool on local machines. Use when requests mention \"kubent\" or require workflows supported by this tool."
---

# kubent

Use this skill to execute **kubent** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2213 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/doitintl/kube-no-trouble
- **License:** MIT
- **Catalog description:** Easily check your clusters for use of deprecated APIs
## Procedure
1. Confirm the tool is available.
   - `command -v kubent`
   - `kubent --version` (fallback: `kubent -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search kubent` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search kubent` then install the matching package.
   - Fedora/RHEL: `dnf search kubent` then install the matching package.
3. Inspect supported commands/options.
   - `kubent --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
