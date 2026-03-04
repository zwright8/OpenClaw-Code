---
name: protoc-gen-grpc-java
description: "Run and troubleshoot the protoc-gen-grpc-java command-line tool on local machines. Use when requests mention \"protoc-gen-grpc-java\" or require workflows supported by this tool."
---

# protoc-gen-grpc-java

Use this skill to execute **protoc-gen-grpc-java** tasks with a consistent, low-risk CLI workflow.

## Tool snapshot
- **Rank:** 2261 (top-5000 inventory)
- **Access:** local-installable
- **Homepage:** https://grpc.io/docs/languages/java/
- **License:** Apache-2.0
- **Catalog description:** Protoc plugin for gRPC Java
## Procedure
1. Confirm the tool is available.
   - `command -v protoc-gen-grpc-java`
   - `protoc-gen-grpc-java --version` (fallback: `protoc-gen-grpc-java -V`)
2. Install when missing, then verify.
   - Homebrew: `brew search protoc-gen-grpc-java` then install the closest matching formula.
   - Debian/Ubuntu: `apt-cache search protoc-gen-grpc-java` then install the matching package.
   - Fedora/RHEL: `dnf search protoc-gen-grpc-java` then install the matching package.
3. Inspect supported commands/options.
   - `protoc-gen-grpc-java --help`
4. Run the requested operation with explicit input/output paths and flags.
5. Validate results.
   - Check exit status, output files, and key stdout/stderr messages.

## Deliver in your response
- Commands executed
- Files created/updated
- Any install/setup changes performed
- Follow-up risks or blockers (if any)
