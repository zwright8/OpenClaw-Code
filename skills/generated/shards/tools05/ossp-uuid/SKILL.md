---
name: ossp-uuid
description: "Run and troubleshoot the ossp-uuid command-line tool on local machines. Use when requests mention \"ossp-uuid\" or require workflows supported by this tool."
---

# ossp-uuid

Use this skill to execute **ossp-uuid** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2120 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** http://www.ossp.org/pkg/lib/uuid/
- **License:** BSD-1-Clause
- **Catalog description:** ISO-C API and CLI for generating UUIDs
## Procedure
1. Confirm the tool is available.
   - `command -v ossp-uuid`
   - `ossp-uuid --version` (fallback: `ossp-uuid -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ossp-uuid` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ossp-uuid` then install the matching package.
   - Fedora/RHEL: `dnf search ossp-uuid` then install the matching package.
3. Inspect supported commands/options.
   - `ossp-uuid --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
