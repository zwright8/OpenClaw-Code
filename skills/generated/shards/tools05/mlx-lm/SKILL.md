---
name: mlx-lm
description: "Run and troubleshoot the mlx-lm command-line tool on local machines. Use when requests mention \"mlx-lm\" or require workflows supported by this tool."
---

# mlx-lm

Use this skill to execute **mlx-lm** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2380 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/ml-explore/mlx-lm
- **License:** MIT
- **Catalog description:** Run LLMs with MLX
## Procedure
1. Confirm the tool is available.
   - `command -v mlx-lm`
   - `mlx-lm --version` (fallback: `mlx-lm -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search mlx-lm` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search mlx-lm` then install the matching package.
   - Fedora/RHEL: `dnf search mlx-lm` then install the matching package.
3. Inspect supported commands/options.
   - `mlx-lm --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
