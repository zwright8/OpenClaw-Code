---
name: onnx
description: "Run and troubleshoot the onnx command-line tool on local machines. Use when requests mention \"onnx\" or require workflows supported by this tool."
---

# onnx

Use this skill to execute **onnx** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2323 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://onnx.ai/
- **License:** Apache-2.0
- **Catalog description:** Open standard for machine learning interoperability
## Procedure
1. Confirm the tool is available.
   - `command -v onnx`
   - `onnx --version` (fallback: `onnx -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search onnx` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search onnx` then install the matching package.
   - Fedora/RHEL: `dnf search onnx` then install the matching package.
3. Inspect supported commands/options.
   - `onnx --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
