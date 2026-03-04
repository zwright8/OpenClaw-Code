---
name: tomcat-10
description: "Run and troubleshoot the tomcat@10 command-line tool on local machines. Use when requests mention \"tomcat@10\" or require workflows supported by this tool."
---

# tomcat@10

Use this skill to execute **tomcat@10** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2193 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://tomcat.apache.org/
- **License:** Apache-2.0
- **Catalog description:** Implementation of Java Servlet and JavaServer Pages
- **Executable hint:** package/catalog name is `tomcat@10`, while the runnable binary is often `tomcat`.
## Procedure
1. Confirm the tool is available.
   - `command -v tomcat`
   - `tomcat --version` (fallback: `tomcat -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search tomcat@10` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search tomcat@10` then install the matching package.
   - Fedora/RHEL: `dnf search tomcat@10` then install the matching package.
3. Inspect supported commands/options.
   - `tomcat --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
