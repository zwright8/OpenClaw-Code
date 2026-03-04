---
name: minify
description: "Run and troubleshoot the minify command-line tool on local machines. Use when requests mention \"minify\" or require workflows supported by this tool."
---

# minify

Use this skill to execute **minify** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2124 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://go.tacodewolff.nl/minify
- **License:** MIT
- **Catalog description:** Minifier for HTML, CSS, JS, JSON, SVG, and XML
## Procedure
1. Confirm the tool is available.
   - `command -v minify`
   - `minify --version` (fallback: `minify -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search minify` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search minify` then install the matching package.
   - Fedora/RHEL: `dnf search minify` then install the matching package.
3. Inspect supported commands/options.
   - `minify --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
