---
name: x-twitter-sync-orchestrator
description: Use when tasks require x twitter sync orchestrator with credential-aware preflight, deterministic execution, validation gates, and handoff-ready artifacts.
---

# X Twitter Sync Orchestrator

## Quick Reference
| Field | Value |
| --- | --- |
| Skill ID | `772` |
| Provider | `X Twitter` |
| Operation | `Sync Orchestrator` |
| Domain | `External SaaS integrations` |
| Runtime archetype | `sync-orchestration-engine` |
| Core method | `cursor-based reconciliation` |
| Primary artifact | `x-twitter-reconciliation-bundle` |
| Routing tag | `x-twitter:sync-orchestrator` |
| Mutating | `yes` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because X Twitter workflows degrade when auth, schema, and side-effect handling drift when integrations are run ad hoc. This specific skill turns X Twitter Sync Orchestrator into a deterministic, auth-checked workflow for schedules and reconciles two-way sync for x twitter records..

## Trigger Checklist
- [ ] The task explicitly requires `X Twitter Sync Orchestrator` rather than generic brainstorming.
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
| OAuth client or delegated session | `oauth2` | `X_TWITTER_CLIENT_ID`, `X_TWITTER_CLIENT_SECRET` | Reuse an active delegated session or validate the client credentials with a lightweight identity call. |
| Access token or personal access token | `token` | `X_TWITTER_TOKEN`, `X_TWITTER_ACCESS_TOKEN` | Validate the token with the smallest read-only endpoint that proves scope and tenancy. |

## Inputs (contract)
| Input | Type | Required | Source |
| --- | --- | --- | --- |
| source cursor | signal | yes | operator or upstream tool |
| destination state | signal | yes | operator or upstream tool |
| conflict policy | signal | yes | operator or upstream tool |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
| --- | --- | --- | --- |
| x-twitter-reconciliation-bundle | structured-artifact | yes | next workflow or operator |
| x-twitter-reconciliation-bundle-scorecard | scorecard | yes | reviewer |
| x-twitter-reconciliation-bundle-handoff | handoff-packet | yes | downstream owner |

## Step-by-Step Implementation Guide
1. Define the systems, entities, and conflict policy for X Twitter Sync Orchestrator, then checkpoint the last known good cursor on both sides of X Twitter.
2. Validate credential reuse and rate-limit posture for every participating endpoint before the sync window opens.
3. Specify delta-fetch, reconciliation, and idempotency contracts for schedules and reconciles two-way sync for x twitter records., including replay safety and backfill rules.
4. Process deltas in deterministic batches, checkpoint after every write phase, and quarantine records that exceed conflict thresholds.
5. Exercise simulation and regression suites that cover stale cursors, duplicate deliveries, and asymmetric provider failures.
6. Publish a reconciliation bundle with drift metrics, conflict counts, and the next checkpoint required for autonomous continuation.

## Operational Runbook
### Preflight
- Verify both source and destination auth contexts and confirm the active cursor/checkpoint.
- Agree on the conflict policy before any mutation is emitted to the destination system.

### Execution
- Fetch deltas deterministically, checkpoint every batch, and preserve replay inputs.
- Route unresolved conflicts into a human review queue instead of guessing.

### Recovery
- Freeze the sync window when reconciliation diverges from the checkpointed baseline.
- Replay from the last stable cursor only after the conflict policy is corrected.

### Handoff
- Return checkpoint state, drift summary, and unresolved conflicts with next owners.
- Document whether the destination is caught up, backfilled, or paused pending review.

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
| `E_CURSOR_GAP` | Missing or corrupted source/destination checkpoint. | Freeze sync and require a manually selected replay point. |
| `E_CONFLICT_BURST` | Delta batches exceed safe conflict thresholds. | Block writeback, emit a conflict packet, and route to review. |
| `E_AUTH_CONTEXT` | Either side of the sync lacks valid credentials. | Stop the sync window and revalidate both auth contexts before replay. |

## Tool Call Implementation
- Reuse existing credentials first. Check environment variables, secure stores, and active sessions before prompting.
- Start with the smallest authenticated read or validation call that proves identity and scope.
- Preserve request, response, and approval traces in `x-twitter-reconciliation-bundle` so downstream owners do not need to rediscover context.
- If any auth, contract, or approval gate fails, halt execution and attach remediation guidance instead of guessing.

## Credential Reuse Policy
- Reuse valid provider credentials by default and prefer tenant-scoped sessions over newly created secrets.
- Prompt for credentials only when they are missing, invalid, expired, or point at the wrong environment.
- For webhook flows, validate the signing secret against a known sample before accepting live traffic.

## Guardrails
- quality: Checkpoint every delta batch before applying destination writes. (`cursor-checkpoint`)
- reliability: Reconcile from the last stable cursor after failures or drift. (`cursor-replay`)
- compliance: Escalate unresolved conflicts instead of auto-merging beyond policy. (`conflict-review-queue`)

## Acceptance Checklist
- [ ] Credential preflight and scope validation completed successfully.
- [ ] Required validation suites ran and all fail-closed gates passed.
- [ ] x-twitter-reconciliation-bundle, scorecard, and handoff packet were produced.
- [ ] Any mutations, approvals, or rollbacks are reflected in the artifact bundle.

## Anti-Patterns
- Do not ask for new credentials before checking reusable auth context.
- Do not skip the read-only or dry-run validation step for mutating work.
- Do not proceed when approval gates, signing secrets, or rollback checkpoints are missing.
- Do not hand off partial or ambiguous provider state as complete.

## Handoff Contract
- **Produces:** `x-twitter-reconciliation-bundle`, execution scorecard, approval trace, and next actions.
- **Consumes:** `source cursor`, `destination state`, `conflict policy`.
- **Readiness rule:** release only after auth, contract, approval, and reliability gates all pass.
- **Downstream hint:** route to `x-twitter:sync-orchestrator` consumers with approval and credential context attached.

## Observability & Continuous Improvement
- SLO: >=99.7% successful runs per 7-day window
- Error budget: <=0.3% critical failures per 7-day window
- Alert triggers:
- credential validation failures exceed baseline
- schema or contract regressions persist for two consecutive runs
- critical posture or rollback events exceed tolerance
- Primary outcome metric: `sync lag`
- Secondary metrics: `reconciliation completion rate`, `conflict resolution accuracy`
- Review cadence: `weekly`
