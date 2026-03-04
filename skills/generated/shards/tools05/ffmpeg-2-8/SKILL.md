---
name: ffmpeg-2-8
description: "Run and troubleshoot the ffmpeg@2.8 command-line tool on local machines. Use when requests mention \"ffmpeg@2.8\" or require workflows supported by this tool."
---

# ffmpeg@2.8

Use this skill to execute **ffmpeg@2.8** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2266 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://ffmpeg.org/
- **License:** GPL-2.0-or-later
- **Catalog description:** Play, record, convert, and stream audio and video
- **Executable hint:** package/catalog name is `ffmpeg@2.8`, while the runnable binary is often `ffmpeg`.
## Procedure
1. Confirm the tool is available.
   - `command -v ffmpeg`
   - `ffmpeg --version` (fallback: `ffmpeg -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search ffmpeg@2.8` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search ffmpeg@2.8` then install the matching package.
   - Fedora/RHEL: `dnf search ffmpeg@2.8` then install the matching package.
3. Inspect supported commands/options.
   - `ffmpeg --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
