---
name: gmsh
description: "Run and troubleshoot the gmsh command-line tool on local machines. Use when requests mention \"gmsh\" or require workflows supported by this tool."
---

# gmsh

Use this skill to execute **gmsh** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2146 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gmsh.info/
- **License:** GPL-2.0-or-later
- **Catalog description:** 3D finite element grid generator with CAD engine
## Procedure
1. Confirm the tool is available.
   - `command -v gmsh`
   - `gmsh --version` (fallback: `gmsh -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gmsh` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gmsh` then install the matching package.
   - Fedora/RHEL: `dnf search gmsh` then install the matching package.
3. Inspect supported commands/options.
   - `gmsh --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
