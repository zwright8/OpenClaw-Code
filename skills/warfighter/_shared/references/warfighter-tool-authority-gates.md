# Warfighter Tool Authority Gates

Use this reference to standardize human-command authority checks before acting on tool-assisted recommendations.

## Required Fields

For recommendations that can change mission posture, include:

- `authority_tier`: tactical, operational, strategic
- `decision_impact_level`: low, medium, high, critical
- `requires_human_approval`: true/false
- `approval_role`: position or watchfloor role
- `audit_record_id`: traceable decision record identifier

## Gate Sequence

1. Verify mission authority and legal basis for the recommended action.
2. Confirm data provenance, freshness, and cross-check status.
3. Assess consequence level and assign required approval role.
4. Obtain human acknowledgment before execution for high, critical, or lethal-adjacent outcomes.
5. Log decision rationale, dissent, and time of approval in UTC.

## Escalation Rules

- If authority scope is uncertain: stop and escalate to command legal/policy review.
- If provenance or confidence is below threshold: publish advisory-only recommendation.
- If conflicting tool outputs exist: require independent adjudication before action.
- If coalition releasability is unclear: restrict to minimum required audience until validated.

## Evidence Requirements

- Record source systems, protocol/transport, and confidence score.
- Capture fallback path and expected mission impact if tooling is unavailable.
- Preserve operator notes for after-action review and model/tool refinement.
