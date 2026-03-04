---
name: scrapy
description: "Run and troubleshoot the scrapy command-line tool on local machines. Use when requests mention \"scrapy\" or require workflows supported by this tool."
---

# scrapy

Use this skill to execute **scrapy** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2111 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://scrapy.org
- **License:** BSD-3-Clause
- **Catalog description:** Web crawling & scraping framework
## Procedure
1. Confirm the tool is available.
   - `command -v scrapy`
   - `scrapy --version` (fallback: `scrapy -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search scrapy` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search scrapy` then install the matching package.
   - Fedora/RHEL: `dnf search scrapy` then install the matching package.
3. Inspect supported commands/options.
   - `scrapy --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
