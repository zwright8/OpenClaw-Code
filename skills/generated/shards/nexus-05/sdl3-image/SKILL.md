---
name: sdl3-image
description: "Run and troubleshoot the sdl3_image command-line tool on local machines. Use when requests mention \"sdl3_image\" or require workflows supported by this tool."
---

# sdl3_image

Use this skill to execute **sdl3_image** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2229 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/libsdl-org/SDL_image
- **License:** Zlib
- **Catalog description:** Library for loading images as SDL surfaces and textures
## Procedure
1. Confirm the tool is available.
   - `command -v sdl3_image`
   - `sdl3_image --version` (fallback: `sdl3_image -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search sdl3_image` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search sdl3_image` then install the matching package.
   - Fedora/RHEL: `dnf search sdl3_image` then install the matching package.
3. Inspect supported commands/options.
   - `sdl3_image --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
