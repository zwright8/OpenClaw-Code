---
name: b04-build-languages-runtimes
description: Use when compiling code, managing language runtimes, or working with cross-platform libraries/toolchains.
---

# Build toolchains, languages & runtimes

## Quick Reference
| Field | Value |
|---|---|
| Skill pack | `b04-build-languages-runtimes` |
| Tool count | `102` |
| Inventory rank span | `1512-2000` |
| References | `references/tools.md`, `references/tools.csv`, `references/workflows.md` |
| Local checker | `scripts/check-tools.sh` |

## Why This Skill Exists
This pack provides a curated operational toolkit for build toolchains, languages & runtimes tasks so operators can select the smallest safe tool, execute with bounded risk, and hand off reproducible outputs.

## When To Use
Use this skill when the request needs concrete tool execution (not pure analysis), and you can name specific binaries, bounded inputs/outputs, and rollback posture before running commands.

## Do Not Use For
- Open-ended ideation without executable acceptance criteria.
- Unbounded production mutations without rollback and approval context.
- Credential discovery, secret exfiltration, or policy-bypassing operations.

## Trigger Checklist
- [ ] The request requires command-line execution across one or more tools in this pack.
- [ ] A minimal viable tool is identifiable from references/tools.md or tools.csv.
- [ ] Inputs/outputs can be bounded (paths, environment, credentials, rollback).
- [ ] Read-only or dry-run mode is attempted before any mutating command.
- [ ] Operator has confirmed intent for potentially destructive actions.

## Tool Selection Framework
- Start with the smallest-scope tool that can satisfy the acceptance criteria.
- Prefer read-only inspection tools before mutation-capable tools.
- When multiple tools overlap, choose the one with clearer rollback semantics and better observability.

## Execution Modes
- **Safe mode:** read-only / `--help` / dry-run only; use for discovery and risk assessment.
- **Standard mode:** bounded writes with explicit output directory and rollback plan.
- **Escalation mode:** high-impact actions only after human confirmation and checklist sign-off.

## Inputs (contract)
| Input | Type | Required | Notes |
|---|---|---|---|
| request scope | text | yes | Goal, acceptance criteria, and risk posture. |
| execution boundaries | object | yes | Paths, credentials context, side-effect tolerance. |
| selected tool(s) | list | yes | Must map directly to the user request. |
| rollback plan | text | yes | Recovery path for failed or unsafe mutations. |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
|---|---|---|---|
| command run log | log bundle | yes | operator / auditor |
| artifacts | files/paths | conditional | downstream workflow |
| validation result | gate summary | yes | orchestrator |
| handoff packet | markdown/json | yes | next owner |

## Task-to-Tool Routing Matrix
| Task intent | Preferred tool | Safe fallback | Mutating | Approval required |
|---|---|---|---|---|
| inventory & read-only diagnosis | `cargo-nextest` | `node-sass` | no | no |
| bounded mutation / transformation | `node-sass` | `cargo-nextest` | yes | yes |
| validation & artifact checks | `cargo-nextest` | `node-sass` | conditional | no |

## Tool Inventory Highlights
| Tool | Typical Use | Access |
|---|---|---|
| `cargo-nextest` | Next-generation test runner for Rust | local-installable |
| `node-sass` | JavaScript implementation of a Sass compiler | local-installable |
| `v8` | Google's JavaScript engine | local-installable |
| `pkl` | CLI for the Pkl programming language | local-installable |
| `arm-linux-gnueabihf-binutils` | FSF/GNU binutils for cross-compiling to arm-linux | local-installable |
| `flatbuffers` | Serialization library for C++, supporting Java, C#, and Go | local-installable |
| `glibc` | GNU C Library | local-installable |
| `oniguruma` | Regular expressions library | local-installable |
| `imlib2` | Image loading and rendering library | local-installable |
| `protobuf@21` | Protocol buffers (Google's data interchange format) | local-installable |
| `poco` | C++ class libraries for building network and internet-based applications | local-installable |
| `minimal-racket` | Modern programming language in the Lisp/Scheme family | local-installable |

## API Protocols & Credential Requirements
| Tool | Primary protocol(s) | Auth mode | Auth required | API key needed | Operator action |
|---|---|---|---|---|---|
| `cargo-nextest` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `node-sass` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `v8` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `pkl` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `arm-linux-gnueabihf-binutils` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `flatbuffers` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `glibc` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `oniguruma` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `imlib2` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `protobuf@21` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `poco` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `minimal-racket` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `dlib` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `taglib` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `portmidi` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `llvm@15` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `gtk-doc` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libirecovery` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `freeglut` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `isl` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `code-cli` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `tinyxml2` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `armadillo` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `proto` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `fribidi` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `exiv2` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `libmatio` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `python-gdbm@3.11` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `xmake` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `llvm@17` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `glog` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `pyside` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `leveldb` | SQL/DB protocol, Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `simdjson` | CLI/local file I/O | None or local runtime | no | no | No API key required for local/offline use. |
| `libdeflate` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `x86_64-linux-gnu-binutils` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `extra-cmake-modules` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `jinja2-cli` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libmemcached` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `json-glib` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `protoc-gen-grpc-web` | gRPC, CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `cppzmq` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libplist` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `libcbor` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `yosys` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `vegeta` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `gtk-mac-integration` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `ghcup` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libmaxminddb` | SQL/DB protocol, Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `wxmaxima` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `xorgproto` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `maturin` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libxrender` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `openslide` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `qscintilla2` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libconfig` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `dtc` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libidn` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `apr` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `libgsf` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `jbang` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `dotnet@6` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `crun` | Local library API/ABI, CLI/stdin-stdout | Account/session credentials | yes | no | Confirm account credentials/session context are configured before execution. |
| `woff2` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `arm-none-eabi-gdb` | SQL/DB protocol, CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libxaw` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `wxpython` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `aarch64-elf-binutils` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `wasm-tools` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `fltk` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `devil` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `python-build` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `apr-util` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `libexif` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `llvm@14` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `google-benchmark` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `newt` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `double-conversion` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `bento4` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `neon` | SFTP/FTP/WebDAV, Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `xonsh` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `scala@2.12` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `lego` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `libpeas` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `eigen@3` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `linux-headers@4.4` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `flang` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `languagetool` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `luajit-openresty` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `apache-flink` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `jsoncpp` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `protobuf@29` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `aarch64-elf-gcc` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `highway` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libxext` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `shaderc` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `rebar3` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libgedit-tepl` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `glpk` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `pypy` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `protobuf@3` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libxkbcommon` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |

## Credential Prompting Rule
- `crun`: Reuse existing credentials/session first and validate access. Ask user only if required credentials are missing or invalid.

## API-Key Prompting Rule
- No pack tools were detected as API-key-required by heuristic scan. Still verify credentials for cloud/account-backed operations.

## Tool Call Implementation
- Use this deterministic call discipline across selected tools:
1. `cargo-nextest` (CLI/stdin-stdout) -> auth preflight (None or local runtime), run read+write command sequence, capture outputs and exit code in handoff packet.
2. `node-sass` (CLI/stdin-stdout) -> auth preflight (None or local runtime), run read+write command sequence, capture outputs and exit code in handoff packet.
3. `v8` (CLI/stdin-stdout) -> auth preflight (None or local runtime), run read+write command sequence, capture outputs and exit code in handoff packet.
4. `pkl` (CLI/stdin-stdout) -> auth preflight (None or local runtime), run read+write command sequence, capture outputs and exit code in handoff packet.
5. `arm-linux-gnueabihf-binutils` (CLI/stdin-stdout) -> auth preflight (None or local runtime), run read+write command sequence, capture outputs and exit code in handoff packet.
6. `flatbuffers` (Local library API/ABI, CLI/stdin-stdout) -> auth preflight (None (local library/runtime)), run read+write command sequence, capture outputs and exit code in handoff packet.
- Always run auth preflight and help/version checks before mutating commands.
- Attach command, protocol, exit status, and artifact paths to the handoff packet for auditability.

## Credential Reuse Policy
- Never ask for a new API key by default if a valid key is already configured.
- Before prompting, check environment/session secret storage and run a lightweight auth validation step.
- Prompt the user only when credentials are missing, invalid, expired, or explicitly rotated/revoked.

## Operational Runbook
### Preflight
- Run local availability check and capture missing binaries.
- Inspect help/version for selected tool(s) before execution.
- Define explicit input and output paths plus rollback strategy.

### Execution
- Start with list/read-only/dry-run flags where supported.
- Execute smallest-scoped command first, then scale incrementally.
- Capture exact command, exit code, and produced artifacts for replayability.

### Recovery
- On command failure, capture stderr/stdout and classify root cause (tool missing, auth, input, runtime).
- Retry only after parameter/input correction; avoid blind repeated retries.
- If mutation occurred and outcome is bad, execute rollback or restore from snapshot/backups.

### Handoff
- Deliver executed-command log, artifact paths, and unresolved risks.
- Document next operator actions and required credentials/context.
- Record changes made to environment, services, or data stores.

## Validation Gates & Test Matrix
| Gate | Purpose | On Fail |
|---|---|---|
| tool-availability-check | Verify required binaries are installed and reachable. | block execution and list install actions |
| command-safety-check | Confirm help/version/dry-run was performed for selected tool. | require preflight rerun |
| artifact-integrity-check | Ensure outputs exist and match expected format/path. | mark run incomplete |
| handoff-completeness-check | Ensure commands, outputs, and risks are documented. | block handoff until complete |

- Starter validation command: `bash ./scripts/check-tools.sh`
- Workflow scaffold: `./references/workflows.md`

## Run Artifact Schema (required)
```json
{
  "tool": "string",
  "cmd": "string",
  "cwd": "string",
  "inputs": ["path-or-identifier"],
  "outputs": ["path-or-identifier"],
  "exit_code": 0,
  "risk_tier": "read-only|local-mutation|network-write|infra-impact",
  "rollback_status": "not-needed|verified|failed",
  "redactions_applied": true
}
```

## Security & Redaction Rules
- Redact API keys, tokens, secrets, and personally identifiable data from logs before handoff.
- Never dump full environment variables or credential files unless explicitly approved for incident response.
- Record only minimum-necessary context to reproduce results safely.

## Failure Modes & Recovery Playbook
- `E_TOOL_MISSING`: required binary not found -> block run and emit install checklist.
- `E_AUTH_CONTEXT`: credentials/profile/context invalid -> halt execution and request corrected context.
- `E_INPUT_BOUNDARY`: unsafe or ambiguous input scope -> require explicit boundary confirmation.
- `E_MUTATION_RISK`: side-effect risk exceeds approved posture -> stop and escalate before mutating.

## Human Approval & Escalation
- Require explicit human confirmation before destructive actions or environment-wide mutations.
- Escalate when rollback path is unavailable or artifact integrity cannot be proven.
- Escalation packet must include attempted command, observed failure, impact scope, and rollback status.

## Acceptance Checklist
- [ ] Selected tool is explicitly mapped to the request and validated via help/version checks.
- [ ] Execution boundaries (paths, credentials, side effects) are documented before run.
- [ ] Artifacts and logs are captured and integrity-checked.
- [ ] Handoff packet includes unresolved risks, rollback status, and next operator actions.

## Practical Usage Examples
1. Select a minimal tool from this pack to solve a build toolchains, languages & runtimes request, run dry-run first, then produce a validated artifact bundle.
2. Use check-tools + help/version to triage a failing workflow and identify whether issue is install, auth, or input contract.
3. Perform controlled migration/automation run with explicit rollback notes and handoff packet for the next on-call operator.

## Anti-Patterns
- Do not execute random tools from the pack without mapping to the request.
- Do not run mutating commands before dry-run/help validation when available.
- Do not omit command logs, artifact paths, or exit status from handoff.
- Do not assume credentials/context are loaded; verify before execution.

## Handoff Contract
- **Produces:** command log, artifact list, validation results, and remaining risk notes.
- **Consumes:** bounded request scope, explicit inputs/paths, and operator intent.
- **Readiness rule:** handoff is complete only when all validation gates pass and output artifacts are verifiable.
- **Escalation rule:** escalate to human owner if required tools are unavailable, credentials are invalid, or rollback cannot be guaranteed.

## Continuous Improvement Loop
- Capture recurring failures and update `references/workflows.md` with safer defaults.
- Promote frequently used command patterns into reusable templates with dry-run examples.
- Review monthly for deprecated tools, auth changes, and safer alternatives.
