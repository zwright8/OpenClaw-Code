---
name: aws-amplify
description: "Run and troubleshoot the aws-amplify command-line tool on local machines. Use when requests mention \"aws-amplify\" or require workflows supported by this tool."
---

# aws-amplify

Use this skill to execute **aws-amplify** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2090 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://aws.amazon.com/amplify/
- **License:** Apache-2.0
- **Catalog description:** Build full-stack web and mobile apps in hours. Easy to start, easy to scale
## Procedure
1. Confirm the tool is available.
   - `command -v aws-amplify`
   - `aws-amplify --version` (fallback: `aws-amplify -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search aws-amplify` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search aws-amplify` then install the matching package.
   - Fedora/RHEL: `dnf search aws-amplify` then install the matching package.
3. Inspect supported commands/options.
   - `aws-amplify --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
