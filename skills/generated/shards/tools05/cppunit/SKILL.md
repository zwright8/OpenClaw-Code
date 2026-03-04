---
name: cppunit
description: "Run and troubleshoot the cppunit command-line tool on local machines. Use when requests mention \"cppunit\" or require workflows supported by this tool."
---

# cppunit

Use this skill to execute **cppunit** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2492 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://wiki.freedesktop.org/www/Software/cppunit/
- **License:** LGPL-2.1-only
- **Catalog description:** Unit testing framework for C++
## Procedure
1. Confirm the tool is available.
   - `command -v cppunit`
   - `cppunit --version` (fallback: `cppunit -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search cppunit` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search cppunit` then install the matching package.
   - Fedora/RHEL: `dnf search cppunit` then install the matching package.
3. Inspect supported commands/options.
   - `cppunit --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
