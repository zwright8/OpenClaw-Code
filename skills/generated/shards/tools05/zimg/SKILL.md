---
name: zimg
description: "Run and troubleshoot the zimg command-line tool on local machines. Use when requests mention \"zimg\" or require workflows supported by this tool."
---

# zimg

Use this skill to execute **zimg** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2241 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/sekrit-twc/zimg
- **License:** WTFPL
- **Catalog description:** Scaling, colorspace conversion, and dithering library
## Procedure
1. Confirm the tool is available.
   - `command -v zimg`
   - `zimg --version` (fallback: `zimg -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search zimg` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search zimg` then install the matching package.
   - Fedora/RHEL: `dnf search zimg` then install the matching package.
3. Inspect supported commands/options.
   - `zimg --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
