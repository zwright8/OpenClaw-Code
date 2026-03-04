---
name: apache-arrow-glib
description: "Run and troubleshoot the apache-arrow-glib command-line tool on local machines. Use when requests mention \"apache-arrow-glib\" or require workflows supported by this tool."
---

# apache-arrow-glib

Use this skill to execute **apache-arrow-glib** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2223 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://arrow.apache.org/
- **License:** Apache-2.0
- **Catalog description:** GLib bindings for Apache Arrow
## Procedure
1. Confirm the tool is available.
   - `command -v apache-arrow-glib`
   - `apache-arrow-glib --version` (fallback: `apache-arrow-glib -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search apache-arrow-glib` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search apache-arrow-glib` then install the matching package.
   - Fedora/RHEL: `dnf search apache-arrow-glib` then install the matching package.
3. Inspect supported commands/options.
   - `apache-arrow-glib --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
