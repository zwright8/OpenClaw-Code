---
name: slack-connector
description: Use when tasks require slack connector with credential-aware preflight, deterministic execution, validation gates, and handoff-ready artifacts.
---

# Slack Connector

## Quick Reference
| Field | Value |
| --- | --- |
| Skill ID | `71` |
| Provider | `Slack` |
| Operation | `Connector` |
| Domain | `Messaging and communications platforms` |
| Runtime archetype | `integration-connector` |
| Core method | `auth-scoped api mediation` |
| Primary artifact | `slack-connection-trace-bundle` |
| Routing tag | `slack:connector` |
| Mutating | `yes` |
| Release cycles | `2` |

## Why This Skill Exists
We need this skill because Slack workflows degrade when auth, schema, and side-effect handling drift when integrations are run ad hoc. This specific skill turns Slack Connector into a deterministic, auth-checked workflow for unified read/write connector for slack apis and data..

## Trigger Checklist
- [ ] The task explicitly requires `Slack Connector` rather than generic brainstorming.
- [ ] The provider tenant, workspace, or environment is known before execution begins.
- [ ] Credential reuse has been checked before asking for new secrets.
- [ ] Success criteria, side effects, and handoff owner are clear.
- [ ] If the run mutates provider state, the relevant approval gates are available.

## Auth & Access Profile
| Field | Value |
| --- | --- |
| External auth required | `yes` |
| API key likely required | `yes` |
| Protocols | `HTTPS/REST`, `webhook callbacks` |
| Mutating | `yes` |
| Webhook capable | `no` |

| Auth Mode | Kind | Env Hints | Validation |
| --- | --- | --- | --- |
| OAuth client or delegated session | `oauth2` | `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET` | Reuse an active delegated session or validate the client credentials with a lightweight identity call. |
| Access token or personal access token | `token` | `SLACK_TOKEN`, `SLACK_ACCESS_TOKEN` | Validate the token with the smallest read-only endpoint that proves scope and tenancy. |

## Inputs (contract)
| Input | Type | Required | Source |
| --- | --- | --- | --- |
| auth context | signal | yes | operator or upstream tool |
| resource scope | signal | yes | operator or upstream tool |
| request contract | signal | yes | operator or upstream tool |

## Outputs (contract)
| Output | Type | Guaranteed | Consumer |
| --- | --- | --- | --- |
| slack-connection-trace-bundle | structured-artifact | yes | next workflow or operator |
| slack-connection-trace-bundle-scorecard | scorecard | yes | reviewer |
| slack-connection-trace-bundle-handoff | handoff-packet | yes | downstream owner |

## Step-by-Step Implementation Guide
1. Define the objective, target resources, and permitted side effects for Slack Connector, then confirm the smallest read-only probe that proves access to Slack.
2. Resolve credential reuse first, validate identity and scopes, and only ask for new secrets if the existing auth context is missing, invalid, or expired.
3. Specify the request and response contract for unified read/write connector for slack apis and data., including idempotency rules and provider rate-limit posture.
4. Execute the read-only probe, widen to the minimum required write scope, and capture deterministic request/response traces for every call.
5. Run integration and regression checks that cover auth expiry, scope mismatch, and rate limiting before approving downstream automation reuse.
6. Publish a connection bundle with scopes, created artifacts, and next-action guidance for any workflow that depends on this provider session.

## Operational Runbook
### Preflight
- Verify credential reuse candidates before asking for new secrets.
- Start with the minimum read-only probe that proves identity, scope, and rate-limit posture.

### Execution
- Execute the smallest valid API operation first, then widen scope only after validation passes.
- Capture endpoint, request shape, and response identifiers in the handoff bundle.

### Recovery
- On auth or permission failure, stop writes, preserve diagnostics, and fall back to read-only verification.
- On mutating error, revoke the write session and reconcile resulting state before retry.

### Handoff
- Return the validated connection state, scopes used, and any newly created IDs or URLs.
- Document whether the session is safe for downstream automation or requires human re-approval.

## Validation Gates & Test Matrix
| Gate | Purpose | On Fail |
| --- | --- | --- |
| auth-preflight | Validate credential presence, scope, and environment before work begins. | block execution |
| schema-contract-check | Ensure required signals and payload shapes remain valid. | quarantine and request correction |
| policy-approval-check | Verify the declared approval gates before mutating or publishing state. | pause or route to human review |
| reliability-check | Confirm retries, rollback, and checkpoint readiness. | rollback or fail closed |

- Required validation suites: `unit`, `integration`, `regression-baseline`

## Failure Modes & Recovery Playbook
| Code | Trigger | Action |
| --- | --- | --- |
| `E_AUTH_CONTEXT` | Missing, invalid, or expired provider credentials. | Fail closed, capture auth diagnostics, and request corrected auth context. |
| `E_SCOPE_MISMATCH` | Credential exists but required scopes or permissions are absent. | Block mutating operations and route to human review with exact missing scopes. |
| `E_PROVIDER_RATE_LIMIT` | Provider rejects calls due to throttling or abuse detection. | Apply retry budget, reduce concurrency, and resume with read-only verification. |

## Tool Call Implementation
- Reuse existing credentials first. Check environment variables, secure stores, and active sessions before prompting.
- Start with the smallest authenticated read or validation call that proves identity and scope.
- Preserve request, response, and approval traces in `slack-connection-trace-bundle` so downstream owners do not need to rediscover context.
- If any auth, contract, or approval gate fails, halt execution and attach remediation guidance instead of guessing.

## Credential Reuse Policy
- Reuse valid provider credentials by default and prefer tenant-scoped sessions over newly created secrets.
- Prompt for credentials only when they are missing, invalid, expired, or point at the wrong environment.
- For webhook flows, validate the signing secret against a known sample before accepting live traffic.

## Guardrails
- quality: Require an auth preflight and read-only probe before any write-capable call. (`auth-preflight+read-probe`)
- reliability: Throttle retries and reconcile provider state after write failures. (`retry-budget+state-reconcile`)
- compliance: Enforce least privilege and preserve the scopes used for the run. (`scope-audit`)
- compliance: Validate provider key or secret mode (sandbox vs production) before any mutating execution. (`credential-mode-check`)

## Acceptance Checklist
- [ ] Credential preflight and scope validation completed successfully.
- [ ] Required validation suites ran and all fail-closed gates passed.
- [ ] slack-connection-trace-bundle, scorecard, and handoff packet were produced.
- [ ] Any mutations, approvals, or rollbacks are reflected in the artifact bundle.

## Anti-Patterns
- Do not ask for new credentials before checking reusable auth context.
- Do not skip the read-only or dry-run validation step for mutating work.
- Do not proceed when approval gates, signing secrets, or rollback checkpoints are missing.
- Do not hand off partial or ambiguous provider state as complete.

## Handoff Contract
- **Produces:** `slack-connection-trace-bundle`, execution scorecard, approval trace, and next actions.
- **Consumes:** `auth context`, `resource scope`, `request contract`.
- **Readiness rule:** release only after auth, contract, approval, and reliability gates all pass.
- **Downstream hint:** route to `slack:connector` consumers with approval and credential context attached.

## Observability & Continuous Improvement
- SLO: >=99.9% successful runs per 7-day window
- Error budget: <=0.1% critical failures per 7-day window
- Alert triggers:
- credential validation failures exceed baseline
- schema or contract regressions persist for two consecutive runs
- critical posture or rollback events exceed tolerance
- Primary outcome metric: `auth success rate`
- Secondary metrics: `request validation pass rate`, `side-effect correctness`
- Review cadence: `daily`
