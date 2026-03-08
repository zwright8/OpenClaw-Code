---
name: youtube-alert-monitor
description: Use when tasks require youtube alert monitor with credential-aware preflight, deterministic execution, validation gates, and handoff-ready artifacts.
---

# YouTube Alert Monitor

## Quick Reference
| Field | Value |
| --- | --- |
| Skill ID | `747` |
| Provider | `YouTube` |
| Operation | `Alert Monitor` |
| Domain | `External SaaS integrations` |
| Runtime archetype | `monitoring-engine` |
| Core method | `threshold evaluation and escalation` |
| Primary artifact | `youtube-alert-state-bundle` |
| Routing tag | `youtube:alert-monitor` |
| Mutating | `yes` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because YouTube workflows degrade when auth, schema, and side-effect handling drift when integrations are run ad hoc. This specific skill turns YouTube Alert Monitor into a deterministic, auth-checked workflow for monitors key youtube signals and raises actionable alerts..

## Trigger Checklist
- [ ] The task explicitly requires `YouTube Alert Monitor` rather than generic brainstorming.
- [ ] The provider tenant, workspace, or environment is known before execution begins.
- [ ] Credential reuse has been checked before asking for new secrets.
- [ ] Success criteria, side effects, and handoff owner are clear.
- [ ] If the run mutates provider state, the relevant approval gates are available.

## Auth & Access Profile
| Field | Value |
| --- | --- |
| External auth required | `yes` |
| API key likely required | `no` |
| Protocols | `HTTPS/REST` |
| Mutating | `yes` |
| Webhook capable | `no` |

| Auth Mode | Kind | Env Hints | Validation |
| --- | --- | --- | --- |
| OAuth client or delegated session | `oauth2` | `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET` | Reuse an active delegated session or validate the client credentials with a lightweight identity call. |
| Access token or personal access token | `token` | `YOUTUBE_TOKEN`, `YOUTUBE_ACCESS_TOKEN` | Validate the token with the smallest read-only endpoint that proves scope and tenancy. |

## Inputs (contract)
| Input | Type | Required | Source |
| --- | --- | --- | --- |
| monitor targets | signal | yes | operator or upstream tool |
| threshold policy | signal | yes | operator or upstream tool |
| escalation channels | signal | yes | operator or upstream tool |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
| --- | --- | --- | --- |
| youtube-alert-state-bundle | structured-artifact | yes | next workflow or operator |
| youtube-alert-state-bundle-scorecard | scorecard | yes | reviewer |
| youtube-alert-state-bundle-handoff | handoff-packet | yes | downstream owner |

## Step-by-Step Implementation Guide
1. Define the monitored signals, freshness expectations, and escalation policy for YouTube Alert Monitor, then lock the reviewed threshold set for YouTube.
2. Validate credential reuse, dedupe windows, and acknowledgement ownership before the monitor starts polling.
3. Implement monitors key youtube signals and raises actionable alerts. with deterministic threshold evaluation, duplicate suppression, and evidence attachment.
4. Persist alert state, suppressed duplicates, and escalation routing details so responders can audit every decision.
5. Run simulation and regression suites that cover stale signals, threshold drift, and duplicate alert storms.
6. Publish an alert-state bundle with threshold version, triggered alerts, and the next review action required for any degraded posture.

## Operational Runbook
### Preflight
- Validate the signal targets, thresholds, and escalation channels before polling begins.
- Confirm the dedupe window and acknowledge who owns follow-up for triggered alerts.

### Execution
- Evaluate signals deterministically against the active threshold set.
- Suppress duplicates and attach enough evidence for the responder to act without re-querying first.

### Recovery
- Silence the pipeline when threshold drift or duplicate storms exceed tolerance.
- Reload the last stable thresholds before resuming alert delivery.

### Handoff
- Return triggered alerts, suppressed duplicates, and escalation destinations.
- Include threshold version, supporting evidence links, and acknowledgement expectations.

## Validation Gates & Test Matrix
| Gate | Purpose | On Fail |
| --- | --- | --- |
| auth-preflight | Validate credential presence, scope, and environment before work begins. | block execution |
| schema-contract-check | Ensure required signals and payload shapes remain valid. | quarantine and request correction |
| policy-approval-check | Verify the declared approval gates before mutating or publishing state. | pause or route to human review |
| reliability-check | Confirm retries, rollback, and checkpoint readiness. | rollback or fail closed |

- Required validation suites: `unit`, `integration`, `simulation`, `regression-baseline`

## Failure Modes & Recovery Playbook
| Code | Trigger | Action |
| --- | --- | --- |
| `E_THRESHOLD_DRIFT` | Thresholds change without review or diverge from the approved baseline. | Pause alert delivery and require threshold review. |
| `E_DUPLICATE_STORM` | The monitor emits excessive duplicate alerts in the dedupe window. | Silence the pipeline temporarily and reload the last stable suppression policy. |
| `E_SIGNAL_GAP` | The provider signal becomes stale or unreachable. | Emit a degraded-monitoring alert and hold dependent escalations. |

## Tool Call Implementation
- Reuse existing credentials first. Check environment variables, secure stores, and active sessions before prompting.
- Start with the smallest authenticated read or validation call that proves identity and scope.
- Preserve request, response, and approval traces in `youtube-alert-state-bundle` so downstream owners do not need to rediscover context.
- If any auth, contract, or approval gate fails, halt execution and attach remediation guidance instead of guessing.

## Credential Reuse Policy
- Reuse valid provider credentials by default and prefer tenant-scoped sessions over newly created secrets.
- Prompt for credentials only when they are missing, invalid, expired, or point at the wrong environment.
- For webhook flows, validate the signing secret against a known sample before accepting live traffic.

## Guardrails
- quality: Suppress duplicates and require evidence links on every alert. (`dedupe+evidence-attach`)
- reliability: Reload last stable thresholds when alert noise exceeds tolerance. (`threshold-rollback`)
- compliance: Do not change escalation channels or thresholds without recorded review. (`threshold-review`)

## Acceptance Checklist
- [ ] Credential preflight and scope validation completed successfully.
- [ ] Required validation suites ran and all fail-closed gates passed.
- [ ] youtube-alert-state-bundle, scorecard, and handoff packet were produced.
- [ ] Any mutations, approvals, or rollbacks are reflected in the artifact bundle.

## Anti-Patterns
- Do not ask for new credentials before checking reusable auth context.
- Do not skip the read-only or dry-run validation step for mutating work.
- Do not proceed when approval gates, signing secrets, or rollback checkpoints are missing.
- Do not hand off partial or ambiguous provider state as complete.

## Handoff Contract
- **Produces:** `youtube-alert-state-bundle`, execution scorecard, approval trace, and next actions.
- **Consumes:** `monitor targets`, `threshold policy`, `escalation channels`.
- **Readiness rule:** release only after auth, contract, approval, and reliability gates all pass.
- **Downstream hint:** route to `youtube:alert-monitor` consumers with approval and credential context attached.

## Observability & Continuous Improvement
- SLO: >=99.7% successful runs per 7-day window
- Error budget: <=0.3% critical failures per 7-day window
- Alert triggers:
- credential validation failures exceed baseline
- schema or contract regressions persist for two consecutive runs
- critical posture or rollback events exceed tolerance
- Primary outcome metric: `alert precision`
- Secondary metrics: `mean time to acknowledge`, `noise rate`
- Review cadence: `weekly`
