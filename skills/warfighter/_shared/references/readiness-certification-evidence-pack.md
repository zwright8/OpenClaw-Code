# Readiness Certification Evidence Pack

Use this reference to standardize mission-essential task (MET) evidence and readiness certification confidence when a skill recommendation changes unit readiness posture.

## Evidence Pack Schema

Use this schema in outputs:

```text
evidence_packet_id:
met_id:
unit_or_element:
mission_context:
observation_window_utc:
objective_measures:
subjective_assessment:
interoperability_result:
safety_and_legal_checks:
cert_confidence:
status:
closure_actions:
```

## Required Gates

1. MET traceability: Every recommendation that changes readiness must map to at least one `met_id`.
2. Source integrity: Include source system, collection time, and cross-check source.
3. Evaluator trigger: Define who can confirm (`platoon`, `company`, `battalion`, `joint task force`, or named evaluator role).
4. Interoperability check: Record protocol compatibility status and coalition releasability.
5. Safety/legal check: Record status for ROE, medical, environmental, and legal-policy constraints.
6. Confidence scoring: Use a 0.0-1.0 `cert_confidence` and explain the main uncertainty driver.
7. Closure actioning: If status is `provisional`, assign owner and suspense for missing evidence.

## Confidence Scale

- `0.90-1.00` validated: objective measures pass and cross-domain checks complete.
- `0.75-0.89` high: minor data lag or one non-critical assumption remains.
- `0.60-0.74` medium: multiple assumptions remain; suitable for conditional decisions only.
- `<0.60` low: insufficient evidence for readiness claim; requires no-go or controlled pilot only.

## Output Block Template

```text
Readiness Evidence Block
- evidence_packet_id:
- met_id:
- unit_or_element:
- objective_measures:
- interoperability_result:
- safety_and_legal_checks:
- cert_confidence:
- status: validated | provisional | blocked
- closure_actions:
```

## Integration with Other Shared References

- Use with `mission-assurance-checklist.md` for release gating.
- Use with `joint-mission-data-contracts.md` for schema and releasability validation.
- Use with `operational-learning-and-after-action-loop.md` to turn provisional findings into corrective actions.

## Example Evaluator Triggers

- Air domain: sortie generation MET validated only after maintenance, munitions, and airspace interoperability checks all pass.
- Maritime domain: chokepoint sensing MET validated only after false-positive threshold and operator confirmation gate pass.
- Cyber domain: mission network defense MET validated only after dual-source telemetry and authority handoff checks pass.
- Medical domain: casualty movement MET validated only after triage, route risk, and receiving-facility capacity checks pass.
