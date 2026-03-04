---
name: links
description: "Run and troubleshoot the links command-line tool on local machines. Use when requests mention \"links\" or require workflows supported by this tool."
---

# links

Use this skill to execute **links** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2020 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://links.twibright.com/
- **License:** GPL-2.0-or-later WITH openvpn-openssl-exception
- **Catalog description:** Lynx-like WWW browser that supports tables, menus, etc.
## Procedure
1. Confirm the tool is available.
   - `command -v links`
   - `links --version` (fallback: `links -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search links` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search links` then install the matching package.
   - Fedora/RHEL: `dnf search links` then install the matching package.
3. Inspect supported commands/options.
   - `links --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
