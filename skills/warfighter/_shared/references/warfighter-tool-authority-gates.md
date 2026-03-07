# Warfighter Tool Authority Gates

Use this control set when a recommendation could change mission posture, fires, maneuver, collection priorities, public messaging, or coalition data release.

## Required fields

- `authority_tier`: tactical, operational, strategic
- `decision_impact_level`: low, moderate, high, critical
- `approval_role`: accountable commander or delegated authority
- `legal_basis`: ROE/LOAC/policy reference
- `audit_record_id`: persistent decision log identifier

## Gate logic

1. If impact is `high` or `critical`, require named human approval before execution.
2. If legal basis is missing, downgrade to advisory-only and raise immediate legal review task.
3. If source provenance is incomplete, require cross-check from an independent source.
4. If coalition release is involved, validate releasability before data transfer.
5. If tool health is degraded, provide degraded-mode alternative with confidence penalty.
