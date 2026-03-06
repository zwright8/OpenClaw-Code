---
name: security-and-crypto-ops
description: Execute security scanning, vuln management, crypto, and offensive/defensive diagnostics. Use when auditing dependencies, checking secrets, handling certificates, or performing network security validation.
---

# security-and-crypto-ops

## Quick Reference
| Field | Value |
|---|---|
| Skill pack | `security-and-crypto-ops` |
| Tool count | `32` |
| Inventory rank span | `507-993` |
| References | `references/tools.md`, `references/tools.csv`, `references/workflows.md` |
| Local checker | `scripts/check-tools.sh` |

## Why This Skill Exists
This pack provides a curated operational toolkit for security-and-crypto-ops tasks so operators can select the smallest safe tool, execute with bounded risk, and hand off reproducible outputs.

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
| inventory & read-only diagnosis | `grype` | `libgcrypt` | no | no |
| bounded mutation / transformation | `libgcrypt` | `grype` | yes | yes |
| validation & artifact checks | `grype` | `libgcrypt` | conditional | no |

## Tool Inventory Highlights
| Tool | Typical Use | Access |
|---|---|---|
| `grype` | Vulnerability scanner for container images and filesystems | local-installable |
| `libgcrypt` | Cryptographic library based on the code from GnuPG | local-installable |
| `libksba` | X.509 and CMS library | local-installable |
| `tor` | Anonymizing overlay network for TCP | local-installable |
| `syft` | CLI for generating a Software Bill of Materials from container images | local-installable |
| `krb5` | Network authentication protocol | local-installable |
| `sqlmap` | Penetration testing for SQL injection and database servers | local-installable |
| `ykman` | Tool for managing your YubiKey configuration | local-installable |
| `hashcat` | World's fastest and most advanced password recovery utility | local-installable |
| `mbedtls` | Cryptographic & SSL/TLS library | local-installable |
| `dependency-check` | OWASP dependency-check | local-installable |
| `libxmlsec1` | XML security library | local-installable |

## API Protocols & Credential Requirements
| Tool | Primary protocol(s) | Auth mode | Auth required | API key needed | Operator action |
|---|---|---|---|---|---|
| `grype` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libgcrypt` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `libksba` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `tor` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `syft` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `krb5` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `sqlmap` | SQL/DB protocol, CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `ykman` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `hashcat` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `mbedtls` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `dependency-check` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libxmlsec1` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `talisman` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libgpg-error` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `snyk-cli` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `clamav` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `rustls-ffi` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `libassuan` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `osv-scanner` | SQL/DB protocol, CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `nuclei` | DNS, CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `libsodium` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `ghidra` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `openconnect` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `binwalk` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `pinentry` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `ssh-copy-id` | SSH, CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `s2n` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `nettle` | Local library API/ABI, CLI/stdin-stdout | None (local library/runtime) | no | no | No API key required for local library/runtime use. |
| `radare2` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `gobuster` | DNS, CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `aircrack-ng` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |
| `step` | CLI/stdin-stdout | None or local runtime | no | no | No API key required for local/offline use. |

## Credential Prompting Rule
- No tools in this pack were detected as requiring external credentials.

## API-Key Prompting Rule
- No pack tools were detected as API-key-required by heuristic scan. Still verify credentials for cloud/account-backed operations.

## Tool Call Implementation
- Use this deterministic call discipline across selected tools:
1. `grype` (CLI/stdin-stdout) -> auth preflight (None or local runtime), run read+write command sequence, capture outputs and exit code in handoff packet.
2. `libgcrypt` (Local library API/ABI, CLI/stdin-stdout) -> auth preflight (None (local library/runtime)), run read+write command sequence, capture outputs and exit code in handoff packet.
3. `libksba` (Local library API/ABI, CLI/stdin-stdout) -> auth preflight (None (local library/runtime)), run read+write command sequence, capture outputs and exit code in handoff packet.
4. `tor` (CLI/stdin-stdout) -> auth preflight (None or local runtime), run read+write command sequence, capture outputs and exit code in handoff packet.
5. `syft` (CLI/stdin-stdout) -> auth preflight (None or local runtime), run read+write command sequence, capture outputs and exit code in handoff packet.
6. `krb5` (CLI/stdin-stdout) -> auth preflight (None or local runtime), run read+write command sequence, capture outputs and exit code in handoff packet.
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
1. Select a minimal tool from this pack to solve a security-and-crypto-ops request, run dry-run first, then produce a validated artifact bundle.
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
