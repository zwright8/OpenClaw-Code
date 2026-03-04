---
name: ansible-9
description: "Run and troubleshoot the ansible@9 command-line tool on local machines. Use when requests mention \"ansible@9\" or require workflows supported by this tool."
---

# ansible@9

Use this skill to execute **ansible@9** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2196 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.ansible.com/
- **License:** GPL-3.0-or-later
- **Catalog description:** Automate deployment, configuration, and upgrading
- **Executable hint:** package/catalog name is `ansible@9`, while the runnable binary is often `ansible`.
## Procedure
1. Confirm the tool is available.
   - `command -v ansible`
   - `ansible --version` (fallback: `ansible -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ansible@9` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ansible@9` then install the matching package.
   - Fedora/RHEL: `dnf search ansible@9` then install the matching package.
3. Inspect supported commands/options.
   - `ansible --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
