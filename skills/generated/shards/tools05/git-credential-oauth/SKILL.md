---
name: git-credential-oauth
description: "Run and troubleshoot the git-credential-oauth command-line tool on local machines. Use when requests mention \"git-credential-oauth\" or require workflows supported by this tool."
---

# git-credential-oauth

Use this skill to execute **git-credential-oauth** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2240 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/hickford/git-credential-oauth
- **License:** Apache-2.0
- **Catalog description:** Git credential helper that authenticates in browser using OAuth
## Procedure
1. Confirm the tool is available.
   - `command -v git-credential-oauth`
   - `git-credential-oauth --version` (fallback: `git-credential-oauth -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search git-credential-oauth` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search git-credential-oauth` then install the matching package.
   - Fedora/RHEL: `dnf search git-credential-oauth` then install the matching package.
3. Inspect supported commands/options.
   - `git-credential-oauth --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
