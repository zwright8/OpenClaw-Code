---
name: fprobe
description: "Run and troubleshoot the fprobe command-line tool on local machines. Use when requests mention \"fprobe\" or require workflows supported by this tool."
---

# fprobe

Use this skill to execute **fprobe** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2025 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://sourceforge.net/projects/fprobe/
- **License:** GPL-2.0-only
- **Catalog description:** Libpcap-based NetFlow probe
## Procedure
1. Confirm the tool is available.
   - `command -v fprobe`
   - `fprobe --version` (fallback: `fprobe -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search fprobe` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search fprobe` then install the matching package.
   - Fedora/RHEL: `dnf search fprobe` then install the matching package.
3. Inspect supported commands/options.
   - `fprobe --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
