---
name: box-migration-assistant
description: Use when tasks require box migration assistant with credential-aware preflight, deterministic execution, validation gates, and handoff-ready artifacts.
---

# Box Migration Assistant

## Quick Reference
| Field | Value |
| --- | --- |
| Skill ID | `180` |
| Provider | `Box` |
| Operation | `Migration Assistant` |
| Domain | `Productivity and file platforms` |
| Runtime archetype | `migration-engine` |
| Core method | `staged migration planning and cutover` |
| Primary artifact | `box-migration-cutover-plan` |
| Routing tag | `box:migration-assistant` |
| Mutating | `yes` |
| Release cycles | `3` |

## Why This Skill Exists
We need this skill because Box workflows degrade when state changes are hard to undo once they begin. This specific skill turns Box Migration Assistant into a deterministic, auth-checked workflow for plans and executes safe migrations to or from box..

## Trigger Checklist
- [ ] The task explicitly requires `Box Migration Assistant` rather than generic brainstorming.
- [ ] The provider tenant, workspace, or environment is known before execution begins.
- [ ] Credential reuse has been checked before asking for new secrets.
- [ ] Success criteria, side effects, and handoff owner are clear.
- [ ] If the run mutates provider state, the relevant approval gates are available.

## Auth & Access Profile
| Field | Value |
| --- | --- |
| External auth required | `yes` |
| API key likely required | `no` |
| Protocols | `HTTPS/REST`, `provider SDK` |
| Mutating | `yes` |
| Webhook capable | `no` |

| Auth Mode | Kind | Env Hints | Validation |
| --- | --- | --- | --- |
| OAuth client or delegated session | `oauth2` | `BOX_CLIENT_ID`, `BOX_CLIENT_SECRET` | Reuse an active delegated session or validate the client credentials with a lightweight identity call. |

## Inputs (contract)
| Input | Type | Required | Source |
| --- | --- | --- | --- |
| source inventory | signal | yes | operator or upstream tool |
| target mapping | signal | yes | operator or upstream tool |
| rollback plan | signal | yes | operator or upstream tool |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
| --- | --- | --- | --- |
| box-migration-cutover-plan | structured-artifact | yes | next workflow or operator |
| box-migration-cutover-plan-scorecard | scorecard | yes | reviewer |
| box-migration-cutover-plan-handoff | handoff-packet | yes | downstream owner |

## Step-by-Step Implementation Guide
1. Define the source inventory, target mapping, cutover window, and rollback checkpoint for Box Migration Assistant before any Box rehearsal is approved.
2. Validate credential reuse, export baselines, and the human approval chain for every irreversible migration step.
3. Implement plans and executes safe migrations to or from box. as staged rehearsal, checkpoint, and cutover workflows that preserve a deterministic revert path.
4. Capture migration inventories, mapping diffs, checkpoint identifiers, and partial-failure evidence in the cutover plan.
5. Run simulation and regression suites that cover missing inventory, rollback weakness, and partial cutover outcomes.
6. Publish a migration cutover plan with rehearsal status, rollback readiness, and the exact approval still required for production execution.

## Operational Runbook
### Preflight
- Validate the full source inventory, target mapping, cutover window, and rollback checkpoint before rehearsal begins.
- Require an explicit human approval path for every irreversible step in the migration.

### Execution
- Rehearse the migration with deterministic checkpoints before the production cutover is allowed.
- Pause on any unapproved mapping gap or rollback weakness rather than proceeding optimistically.

### Recovery
- Abort cutover immediately when checkpoints or rollback evidence fail validation.
- Revert to the last stable platform state and capture every partially migrated object for review.

### Handoff
- Return the migration cutover plan, rehearsal results, and rollback status.
- State clearly whether the migration is ready, blocked, partially rolled back, or awaiting approval.

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
| `E_INVENTORY_GAP` | The source inventory is incomplete or inconsistent with the target mapping. | Block rehearsal and request a corrected inventory or mapping diff. |
| `E_ROLLBACK_WEAKNESS` | Rollback checkpoints are missing or cannot restore all affected entities. | Fail closed and prohibit cutover approval. |
| `E_PARTIAL_CUTOVER` | The cutover succeeds for only a subset of the planned assets. | Abort the migration and revert to the last stable platform state. |

## Tool Call Implementation
- Reuse existing credentials first. Check environment variables, secure stores, and active sessions before prompting.
- Start with the smallest authenticated read or validation call that proves identity and scope.
- Preserve request, response, and approval traces in `box-migration-cutover-plan` so downstream owners do not need to rediscover context.
- If any auth, contract, or approval gate fails, halt execution and attach remediation guidance instead of guessing.

## Credential Reuse Policy
- Reuse valid provider credentials by default and prefer tenant-scoped sessions over newly created secrets.
- Prompt for credentials only when they are missing, invalid, expired, or point at the wrong environment.
- For webhook flows, validate the signing secret against a known sample before accepting live traffic.

## Guardrails
- safety: Do not permit cutover without a rehearsed rollback checkpoint and explicit approval. (`rollback-readiness-check`)
- quality: Require inventory-to-mapping reconciliation before rehearsal and again before cutover. (`inventory-reconcile`)
- reliability: Abort immediately on partial cutover and revert to the last stable platform state. (`cutover-abort-and-revert`)

## Acceptance Checklist
- [ ] Credential preflight and scope validation completed successfully.
- [ ] Required validation suites ran and all fail-closed gates passed.
- [ ] box-migration-cutover-plan, scorecard, and handoff packet were produced.
- [ ] Any mutations, approvals, or rollbacks are reflected in the artifact bundle.

## Anti-Patterns
- Do not ask for new credentials before checking reusable auth context.
- Do not skip the read-only or dry-run validation step for mutating work.
- Do not proceed when approval gates, signing secrets, or rollback checkpoints are missing.
- Do not hand off partial or ambiguous provider state as complete.

## Handoff Contract
- **Produces:** `box-migration-cutover-plan`, execution scorecard, approval trace, and next actions.
- **Consumes:** `source inventory`, `target mapping`, `rollback plan`.
- **Readiness rule:** release only after auth, contract, approval, and reliability gates all pass.
- **Downstream hint:** route to `box:migration-assistant` consumers with approval and credential context attached.

## Observability & Continuous Improvement
- SLO: >=99.9% successful runs per 7-day window
- Error budget: <=0.1% critical failures per 7-day window
- Alert triggers:
- credential validation failures exceed baseline
- schema or contract regressions persist for two consecutive runs
- critical posture or rollback events exceed tolerance
- Primary outcome metric: `migration completeness`
- Secondary metrics: `cutover risk`, `rollback success rate`
- Review cadence: `daily`
