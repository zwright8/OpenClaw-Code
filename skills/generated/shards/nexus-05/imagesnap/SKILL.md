---
name: imagesnap
description: "Run and troubleshoot the imagesnap command-line tool on local machines. Use when requests mention \"imagesnap\" or require workflows supported by this tool."
---

# imagesnap

Use this skill to execute **imagesnap** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2072 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/rharder/imagesnap
- **License:** LicenseRef-Homebrew-public-domain
- **Catalog description:** Tool to capture still images from an iSight or other video source
## Procedure
1. Confirm the tool is available.
   - `command -v imagesnap`
   - `imagesnap --version` (fallback: `imagesnap -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search imagesnap` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search imagesnap` then install the matching package.
   - Fedora/RHEL: `dnf search imagesnap` then install the matching package.
3. Inspect supported commands/options.
   - `imagesnap --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
