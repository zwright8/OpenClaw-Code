---
name: rakudo-star
description: "Run and troubleshoot the rakudo-star command-line tool on local machines. Use when requests mention \"rakudo-star\" or require workflows supported by this tool."
---

# rakudo-star

Use this skill to execute **rakudo-star** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2426 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://rakudo.org/
- **License:** Artistic-2.0
- **Catalog description:** Rakudo compiler and commonly used packages
## Procedure
1. Confirm the tool is available.
   - `command -v rakudo-star`
   - `rakudo-star --version` (fallback: `rakudo-star -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search rakudo-star` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search rakudo-star` then install the matching package.
   - Fedora/RHEL: `dnf search rakudo-star` then install the matching package.
3. Inspect supported commands/options.
   - `rakudo-star --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
