---
name: u05696-compliance-evidence-mapping-for-disaster-response-networks
description: Operate the "Compliance evidence mapping for disaster response networks" capability in production for disaster response networks workflows. Use when mission execution explicitly requires this capability and outcomes must be reproducible, policy-gated, and handoff-ready.
---

# Compliance evidence mapping for disaster response networks

## Metadata
```yaml
capability_id: u05696-compliance-evidence-mapping-for-disaster-response-networks
capability_name: Compliance evidence mapping for disaster response networks
domain: disaster response networks
lifecycle: production
invocation_mode: explicit
artifact_contract: required
```

## Allowed Tools
- No external API/tool is strictly required.
- Use runtime-provided local tools for file I/O, validation, and logging when available.
- Keep execution deterministic; avoid tools that introduce uncontrolled randomness.

## Inputs (formatted)
```yaml
required:
  capability_request:
    type: string
    description: Explicit request to run "Compliance evidence mapping for disaster response networks".
  domain_scope:
    type: string
    description: Task scope and decision context for disaster response networks.
  source_inputs:
    type: array
    items: object
    description: Source-tagged signals, claims, and evidence used for execution.
  acceptance_criteria:
    type: object
    description: Measurable success criteria, constraints, and guardrails.
  downstream_consumer:
    type: string
    description: Named receiver of outputs (operator, orchestrator, or audit sink).
optional:
  risk_tier:
    type: string
    enum: [low, medium, high]
  approval_token:
    type: string
    description: Required before release when risk_tier is high.
```

## Outputs (formatted)
```yaml
artifacts:
  primary_artifact_bundle:
    type: object
    required: true
    description: Deterministic, schema-valid result package.
  execution_scorecard:
    type: object
    required: true
    description: Gate outcomes, tolerance checks, and confidence notes.
  handoff_packet:
    type: object
    required: true
    description: Next-hop routing metadata, approval state, and audit fields.
status:
  publish_ready:
    type: boolean
    description: True only when all validation gates pass.
```

## Guidelines
1. Start only after confirming explicit capability request and a clear downstream consumer.
2. Normalize inputs with stable ordering and pinned ruleset versions.
3. Make assumptions explicit inside artifacts and scorecards.
4. Fail closed on missing inputs, schema errors, policy conflicts, or unresolved risk.
5. Keep recommendations operational for day-to-day and week-to-week execution.

## Musts
- Must preserve deterministic behavior across identical re-runs.
- Must enforce schema, determinism, policy/risk, and approval gates before handoff.
- Must block publication for high-risk runs without a human approval token.
- Must include traceable provenance for every material claim or decision.
- Must emit machine-readable handoff metadata.

## Targets (day/week/month operating cadence)
- **Day:** Triage active requests, run required gates, and publish only validated artifacts.
- **Week:** Review failures/drift, tune thresholds, and refresh runbook actions.
- **Month:** Re-baseline tolerances, audit policy alignment, and update approval routing.

## Common Actions
1. Validate trigger, scope, and acceptance criteria.
2. Ingest and normalize source-tagged inputs.
3. Execute capability workflow for **Compliance evidence mapping for disaster response networks** in **disaster response networks**.
4. Run validation gates and capture evidence.
5. Produce artifact bundle, scorecard, and handoff packet.
6. Route to downstream consumer or return a fail-closed remediation bundle.

## External Tool Calls Needed
- **Mandatory:** none.
- **Optional:** local file/validation tooling available in the current runtime for schema checks, replay checks, and artifact packaging.

## Validation & Handoff
- Required gates: `schema-gate`, `determinism-gate`, `policy-risk-gate`, `approval-gate-high-risk`.
- Determinism targets: replay score delta `<= 0.005` absolute, identical-input artifact hash drift `= 0`.
- Handoff conditions:
  - Route only when every gate passes.
  - Include `risk_tier`, `approval_state`, `artifact_paths`, and `next_owner`.
  - If any gate fails, return blocked status with remediation steps and do not publish.
