---
name: protoc-gen-grpc-swift
description: "Run and troubleshoot the protoc-gen-grpc-swift command-line tool on local machines. Use when requests mention \"protoc-gen-grpc-swift\" or require workflows supported by this tool."
---

# protoc-gen-grpc-swift

Use this skill to execute **protoc-gen-grpc-swift** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2050 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://github.com/grpc/grpc-swift-protobuf
- **License:** Apache-2.0
- **Catalog description:** Protoc plugin for generating gRPC Swift stubs
## Procedure
1. Confirm the tool is available.
   - `command -v protoc-gen-grpc-swift`
   - `protoc-gen-grpc-swift --version` (fallback: `protoc-gen-grpc-swift -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search protoc-gen-grpc-swift` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search protoc-gen-grpc-swift` then install the matching package.
   - Fedora/RHEL: `dnf search protoc-gen-grpc-swift` then install the matching package.
3. Inspect supported commands/options.
   - `protoc-gen-grpc-swift --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
