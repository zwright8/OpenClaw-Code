---
name: kafkactl
description: "Run and troubleshoot the kafkactl command-line tool on local machines. Use when requests mention \"kafkactl\" or require workflows supported by this tool."
---

# kafkactl

Use this skill to execute **kafkactl** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2047 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://deviceinsight.github.io/kafkactl/
- **License:** Apache-2.0
- **Catalog description:** CLI for managing Apache Kafka
## Procedure
1. Confirm the tool is available.
   - `command -v kafkactl`
   - `kafkactl --version` (fallback: `kafkactl -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search kafkactl` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search kafkactl` then install the matching package.
   - Fedora/RHEL: `dnf search kafkactl` then install the matching package.
3. Inspect supported commands/options.
   - `kafkactl --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
