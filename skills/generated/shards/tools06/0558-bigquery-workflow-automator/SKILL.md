---
name: bigquery-workflow-automator
description: Use when tasks require bigquery workflow automator with credential-aware preflight, deterministic execution, validation gates, and handoff-ready artifacts.
---

# BigQuery Workflow Automator

## Quick Reference
| Field | Value |
| --- | --- |
| Skill ID | `558` |
| Provider | `BigQuery` |
| Operation | `Workflow Automator` |
| Domain | `Data platforms` |
| Runtime archetype | `workflow-orchestration-engine` |
| Core method | `stateful workflow execution` |
| Primary artifact | `bigquery-workflow-runbook` |
| Routing tag | `bigquery:workflow-automator` |
| Mutating | `yes` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because BigQuery workflows degrade when auth, schema, and side-effect handling drift when integrations are run ad hoc. This specific skill turns BigQuery Workflow Automator into a deterministic, auth-checked workflow for executes repeatable multi-step workflows using bigquery..

## Trigger Checklist
- [ ] The task explicitly requires `BigQuery Workflow Automator` rather than generic brainstorming.
- [ ] The provider tenant, workspace, or environment is known before execution begins.
- [ ] Credential reuse has been checked before asking for new secrets.
- [ ] Success criteria, side effects, and handoff owner are clear.
- [ ] If the run mutates provider state, the relevant approval gates are available.

## Auth & Access Profile
| Field | Value |
| --- | --- |
| External auth required | `yes` |
| API key likely required | `no` |
| Protocols | `HTTPS/REST`, `SQL or driver/SDK` |
| Mutating | `yes` |
| Webhook capable | `no` |

| Auth Mode | Kind | Env Hints | Validation |
| --- | --- | --- | --- |
| Service account or machine credential | `service_account` | `BIGQUERY_SERVICE_ACCOUNT_JSON`, `BIGQUERY_CREDENTIALS_FILE` | Verify the machine credential or profile against the target environment before any mutating step. |
| Existing session or local profile | `session` | `BIGQUERY_SESSION`, `BIGQUERY_PROFILE` | Check the current session/profile and confirm it points at the intended tenant or workspace. |

## Inputs (contract)
| Input | Type | Required | Source |
| --- | --- | --- | --- |
| workflow specification | signal | yes | operator or upstream tool |
| trigger context | signal | yes | operator or upstream tool |
| approval policy | signal | yes | operator or upstream tool |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
| --- | --- | --- | --- |
| bigquery-workflow-runbook | structured-artifact | yes | next workflow or operator |
| bigquery-workflow-runbook-scorecard | scorecard | yes | reviewer |
| bigquery-workflow-runbook-handoff | handoff-packet | yes | downstream owner |

## Step-by-Step Implementation Guide
1. Define the workflow graph, mutating boundaries, and approval requirements for BigQuery Workflow Automator, then checkpoint where BigQuery state can be replayed safely.
2. Validate credential reuse and trigger context before any step begins, with a focus on which branches require explicit human sign-off.
3. Implement executes repeatable multi-step workflows using bigquery. as a deterministic sequence of step contracts, approvals, and checkpoint writes.
4. Capture step-level artifacts, side-effect evidence, and pending approvals in the workflow runbook so every branch remains auditable.
5. Run simulation and regression suites that cover missing approvals, missing checkpoints, and contract drift at each step boundary.
6. Publish the workflow runbook with completion state, pending approvals, and the exact checkpoint required for any safe replay.

## Operational Runbook
### Preflight
- Validate the trigger context, approval policy, and downstream side effects for the workflow.
- Confirm which steps are replay-safe and where checkpoints must be stored.

### Execution
- Run one step at a time with checkpointing and approval gates between mutating boundaries.
- Stop immediately when an unapproved branch or ambiguous side effect is encountered.

### Recovery
- Replay only from the last approved checkpoint after correcting the failing step.
- Suspend the workflow when downstream state can no longer be reconciled deterministically.

### Handoff
- Return the executed steps, pending approvals, and checkpoint references.
- Explain whether the workflow finished, paused, rolled back, or is awaiting human action.

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
| `E_APPROVAL_MISSING` | A mutating step is reached without the required approval context. | Pause the workflow and request the missing approval before replay. |
| `E_CHECKPOINT_MISSING` | The last approved checkpoint is absent or corrupted. | Suspend the workflow and rebuild the checkpoint state before retry. |
| `E_STEP_DRIFT` | A workflow step no longer matches the declared contract or side effects. | Block progression, quarantine the step, and route to review. |

## Tool Call Implementation
- Reuse existing credentials first. Check environment variables, secure stores, and active sessions before prompting.
- Start with the smallest authenticated read or validation call that proves identity and scope.
- Preserve request, response, and approval traces in `bigquery-workflow-runbook` so downstream owners do not need to rediscover context.
- If any auth, contract, or approval gate fails, halt execution and attach remediation guidance instead of guessing.

## Credential Reuse Policy
- Reuse valid provider credentials by default and prefer tenant-scoped sessions over newly created secrets.
- Prompt for credentials only when they are missing, invalid, expired, or point at the wrong environment.
- For webhook flows, validate the signing secret against a known sample before accepting live traffic.

## Guardrails
- quality: Checkpoint every step boundary and attach side-effect evidence before proceeding. (`step-checkpoint+evidence-attach`)
- safety: Pause the workflow when approval context is missing or stale. (`workflow-approval-check`)
- reliability: Replay only from approved checkpoints after step failures. (`checkpoint-replay`)

## Acceptance Checklist
- [ ] Credential preflight and scope validation completed successfully.
- [ ] Required validation suites ran and all fail-closed gates passed.
- [ ] bigquery-workflow-runbook, scorecard, and handoff packet were produced.
- [ ] Any mutations, approvals, or rollbacks are reflected in the artifact bundle.

## Anti-Patterns
- Do not ask for new credentials before checking reusable auth context.
- Do not skip the read-only or dry-run validation step for mutating work.
- Do not proceed when approval gates, signing secrets, or rollback checkpoints are missing.
- Do not hand off partial or ambiguous provider state as complete.

## Handoff Contract
- **Produces:** `bigquery-workflow-runbook`, execution scorecard, approval trace, and next actions.
- **Consumes:** `workflow specification`, `trigger context`, `approval policy`.
- **Readiness rule:** release only after auth, contract, approval, and reliability gates all pass.
- **Downstream hint:** route to `bigquery:workflow-automator` consumers with approval and credential context attached.

## Observability & Continuous Improvement
- SLO: >=99.9% successful runs per 7-day window
- Error budget: <=0.1% critical failures per 7-day window
- Alert triggers:
- credential validation failures exceed baseline
- schema or contract regressions persist for two consecutive runs
- critical posture or rollback events exceed tolerance
- Primary outcome metric: `workflow success rate`
- Secondary metrics: `approval latency`, `retry recovery rate`
- Review cadence: `daily`
