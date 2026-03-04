---
name: ansible-creator
description: "Run and troubleshoot the ansible-creator command-line tool on local machines. Use when requests mention \"ansible-creator\" or require workflows supported by this tool."
---

# ansible-creator

Use this skill to execute **ansible-creator** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2245 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://ansible.readthedocs.io/projects/creator/
- **License:** Apache-2.0
- **Catalog description:** CLI tool for scaffolding Ansible Content
## Procedure
1. Confirm the tool is available.
   - `command -v ansible-creator`
   - `ansible-creator --version` (fallback: `ansible-creator -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ansible-creator` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ansible-creator` then install the matching package.
   - Fedora/RHEL: `dnf search ansible-creator` then install the matching package.
3. Inspect supported commands/options.
   - `ansible-creator --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
