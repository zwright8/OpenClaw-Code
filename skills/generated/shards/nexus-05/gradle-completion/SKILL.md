---
name: gradle-completion
description: "Run and troubleshoot the gradle-completion command-line tool on local machines. Use when requests mention \"gradle-completion\" or require workflows supported by this tool."
---

# gradle-completion

Use this skill to execute **gradle-completion** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2411 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://gradle.org/
- **License:** MIT
- **Catalog description:** Bash and Zsh completion for Gradle
## Procedure
1. Confirm the tool is available.
   - `command -v gradle-completion`
   - `gradle-completion --version` (fallback: `gradle-completion -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search gradle-completion` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search gradle-completion` then install the matching package.
   - Fedora/RHEL: `dnf search gradle-completion` then install the matching package.
3. Inspect supported commands/options.
   - `gradle-completion --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
