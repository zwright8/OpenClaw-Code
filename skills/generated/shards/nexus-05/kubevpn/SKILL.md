---
name: kubevpn
description: "Run and troubleshoot the kubevpn command-line tool on local machines. Use when requests mention \"kubevpn\" or require workflows supported by this tool."
---

# kubevpn

Use this skill to execute **kubevpn** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2343 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.kubevpn.dev
- **License:** MIT
- **Catalog description:** Offers a Cloud-Native Dev Environment that connects to your K8s cluster network
## Procedure
1. Confirm the tool is available.
   - `command -v kubevpn`
   - `kubevpn --version` (fallback: `kubevpn -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search kubevpn` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search kubevpn` then install the matching package.
   - Fedora/RHEL: `dnf search kubevpn` then install the matching package.
3. Inspect supported commands/options.
   - `kubevpn --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
