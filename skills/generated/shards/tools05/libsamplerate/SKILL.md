---
name: libsamplerate
description: "Run and troubleshoot the libsamplerate command-line tool on local machines. Use when requests mention \"libsamplerate\" or require workflows supported by this tool."
---

# libsamplerate

Use this skill to execute **libsamplerate** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2230 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/libsndfile/libsamplerate
- **License:** BSD-2-Clause
- **Catalog description:** Library for sample rate conversion of audio data
## Procedure
1. Confirm the tool is available.
   - `command -v libsamplerate`
   - `libsamplerate --version` (fallback: `libsamplerate -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search libsamplerate` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search libsamplerate` then install the matching package.
   - Fedora/RHEL: `dnf search libsamplerate` then install the matching package.
3. Inspect supported commands/options.
   - `libsamplerate --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
