---
name: sdl2-gfx
description: "Run and troubleshoot the sdl2_gfx command-line tool on local machines. Use when requests mention \"sdl2_gfx\" or require workflows supported by this tool."
---

# sdl2_gfx

Use this skill to execute **sdl2_gfx** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2375 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://www.ferzkopp.net/wordpress/2016/01/02/sdl_gfx-sdl2_gfx/
- **License:** Zlib
- **Catalog description:** SDL2 graphics drawing primitives and other support functions
## Procedure
1. Confirm the tool is available.
   - `command -v sdl2_gfx`
   - `sdl2_gfx --version` (fallback: `sdl2_gfx -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search sdl2_gfx` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search sdl2_gfx` then install the matching package.
   - Fedora/RHEL: `dnf search sdl2_gfx` then install the matching package.
3. Inspect supported commands/options.
   - `sdl2_gfx --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
