---
name: protoc-gen-js
description: "Run and troubleshoot the protoc-gen-js command-line tool on local machines. Use when requests mention \"protoc-gen-js\" or require workflows supported by this tool."
---

# protoc-gen-js

Use this skill to execute **protoc-gen-js** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2249 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/protocolbuffers/protobuf-javascript
- **License:** BSD-3-Clause
- **Catalog description:** Protocol buffers JavaScript generator plugin
## Procedure
1. Confirm the tool is available.
   - `command -v protoc-gen-js`
   - `protoc-gen-js --version` (fallback: `protoc-gen-js -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search protoc-gen-js` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search protoc-gen-js` then install the matching package.
   - Fedora/RHEL: `dnf search protoc-gen-js` then install the matching package.
3. Inspect supported commands/options.
   - `protoc-gen-js --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
