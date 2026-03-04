---
name: dcmtk
description: "Run and troubleshoot the dcmtk command-line tool on local machines. Use when requests mention \"dcmtk\" or require workflows supported by this tool."
---

# dcmtk

Use this skill to execute **dcmtk** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2086 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://dicom.offis.de/dcmtk.php.en
- **License:** BSD-3-Clause
- **Catalog description:** OFFIS DICOM toolkit command-line utilities
## Procedure
1. Confirm the tool is available.
   - `command -v dcmtk`
   - `dcmtk --version` (fallback: `dcmtk -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search dcmtk` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search dcmtk` then install the matching package.
   - Fedora/RHEL: `dnf search dcmtk` then install the matching package.
3. Inspect supported commands/options.
   - `dcmtk --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
