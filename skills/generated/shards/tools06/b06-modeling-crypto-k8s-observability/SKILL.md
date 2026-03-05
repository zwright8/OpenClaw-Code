---
name: b06-modeling-crypto-k8s-observability
description: Use when combining scientific/model workloads, cryptographic checks, Kubernetes monitoring, and performance/security governance.
---

# Modeling, cryptography, Kubernetes observability, and performance

## Quick Reference
| Field | Value |
|---|---|
| Skill pack | `b06-modeling-crypto-k8s-observability` |
| Tool count | `25` |
| Inventory rank span | `2879-2909` |
| References | `references/tools.md`, `references/tools.csv`, `references/workflows.md` |
| Local checker | `scripts/check-tools.sh` |

## Why This Skill Exists
This pack provides a curated operational toolkit for modeling, cryptography, kubernetes observability, performance tasks so operators can select the smallest safe tool, execute with bounded risk, and hand off reproducible outputs.

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
| inventory & read-only diagnosis | `recc` | `dynare` | no | no |
| bounded mutation / transformation | `dynare` | `recc` | yes | yes |
| validation & artifact checks | `recc` | `dynare` | conditional | no |

## Tool Inventory Highlights
| Tool | Typical Use | Access |
|---|---|---|
| `recc` | Remote Execution Caching Compiler | local-installable |
| `dynare` | Platform for economic models, particularly DSGE and OLG models | local-installable |
| `logrotate` | Rotates, compresses, and mails system logs | local-installable |
| `qrtool` | Utility for encoding or decoding QR code | local-installable |
| `oasdiff` | OpenAPI Diff and Breaking Changes | local-installable |
| `dstack` | ML workflow orchestration system designed for reproducibility and collaboration | local-installable |
| `fastmcp` | Fast, Pythonic way to build MCP servers and clients | local-installable |
| `bcrypt` | Cross platform file encryption utility using blowfish | local-installable |
| `closure-compiler` | JavaScript optimizing compiler | local-installable |
| `jack` | Audio Connection Kit | local-installable |
| `kubetui` | TUI tool for monitoring and exploration of Kubernetes resources | local-installable |
| `ffms2` | Libav/ffmpeg based source library and Avisynth plugin | local-installable |

## API Protocols & Credential Requirements
| Tool | Primary protocol(s) | Auth mode | Auth required | API key needed | Operator action |
|---|---|---|---|---|---|
| `recc` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `dynare` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `logrotate` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `qrtool` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `oasdiff` | HTTPS/REST, CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `dstack` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `fastmcp` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `bcrypt` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `closure-compiler` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `jack` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `kubetui` | CLI/stdin-stdout | Account/session credentials | yes | no | Confirm account credentials/session context are configured before execution. |
| `ffms2` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `libimagequant` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `libmodbus` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `cargo-update` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `scorecard` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `javacc` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `volk` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `vnstat` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `nzbget` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `ignite` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `jsonnet-bundler` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `metals` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `qtbase` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `fabric` | SSH, Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |

## Credential Prompting Rule
- `kubetui`: Reuse existing credentials/session first and validate access. Ask user only if required credentials are missing or invalid.

## API-Key Prompting Rule
- No pack tools were detected as API-key-required by heuristic scan. Still verify credentials for cloud/account-backed operations.

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
1. Select a minimal tool from this pack to solve a modeling, cryptography, kubernetes observability, performance request, run dry-run first, then produce a validated artifact bundle.
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
