---
name: spirv-tools
description: "Run and troubleshoot the spirv-tools command-line tool on local machines. Use when requests mention \"spirv-tools\" or require workflows supported by this tool."
---

# spirv-tools

Use this skill to execute **spirv-tools** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2433 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/KhronosGroup/SPIRV-Tools
- **License:** Apache-2.0
- **Catalog description:** API and commands for processing SPIR-V modules
## Procedure
1. Confirm the tool is available.
   - `command -v spirv-tools`
   - `spirv-tools --version` (fallback: `spirv-tools -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search spirv-tools` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search spirv-tools` then install the matching package.
   - Fedora/RHEL: `dnf search spirv-tools` then install the matching package.
3. Inspect supported commands/options.
   - `spirv-tools --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
