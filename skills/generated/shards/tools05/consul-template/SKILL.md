---
name: consul-template
description: "Run and troubleshoot the consul-template command-line tool on local machines. Use when requests mention \"consul-template\" or require workflows supported by this tool."
---

# consul-template

Use this skill to execute **consul-template** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2217 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/hashicorp/consul-template
- **License:** MPL-2.0
- **Catalog description:** Generic template rendering and notifications with Consul
## Procedure
1. Confirm the tool is available.
   - `command -v consul-template`
   - `consul-template --version` (fallback: `consul-template -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search consul-template` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search consul-template` then install the matching package.
   - Fedora/RHEL: `dnf search consul-template` then install the matching package.
3. Inspect supported commands/options.
   - `consul-template --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
