---
name: video-compare
description: "Run and troubleshoot the video-compare command-line tool on local machines. Use when requests mention \"video-compare\" or require workflows supported by this tool."
---

# video-compare

Use this skill to execute **video-compare** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2454 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/pixop/video-compare
- **License:** GPL-2.0-only
- **Catalog description:** Split screen video comparison tool using FFmpeg and SDL2
## Procedure
1. Confirm the tool is available.
   - `command -v video-compare`
   - `video-compare --version` (fallback: `video-compare -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search video-compare` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search video-compare` then install the matching package.
   - Fedora/RHEL: `dnf search video-compare` then install the matching package.
3. Inspect supported commands/options.
   - `video-compare --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
