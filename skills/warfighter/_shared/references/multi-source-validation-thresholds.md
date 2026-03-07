# Multi-Source Validation Thresholds (Warfighter)

Use this reference to set minimum validation depth before releasing recommendations that could change force posture, targeting, maneuver timing, or strategic messaging.

## Validation Tiers

- Tier 0 (administrative): one authoritative source is acceptable; mark as low consequence.
- Tier 1 (routine operational): one primary source plus one freshness check (same or adjacent system).
- Tier 2 (time-sensitive tactical): one primary source plus one independent cross-check source before release.
- Tier 3 (high-consequence operational): two independent sources plus one command confirmation path (human or approved automation gate).
- Tier 4 (strategic or escalation-sensitive): two independent sources, one legal/policy validation, and one explicit commander approval checkpoint.

## Minimum Source Independence Rules

- Source independence requires separate collection paths, processing chains, or organizational ownership.
- Mirrors or caches of the same origin do not count as independent confirmation.
- If independence cannot be achieved inside the decision window, publish advisory-only with explicit uncertainty penalties.

## Freshness and Staleness Gates

- Always include `last_refresh_utc`, `refresh_sla_minutes`, and `staleness_trigger`.
- If any critical source exceeds SLA, switch to degraded mode and include expected confidence loss.
- For high-velocity scenarios, use shortest available source SLA as the release gate.

## Contradiction Handling Protocol

1. Label contradiction class: timing mismatch, geospatial mismatch, identity mismatch, or intent mismatch.
2. Hold high-consequence recommendation release until contradiction is resolved or commander accepts uncertainty.
3. Provide side-by-side comparison with confidence and source lineage for each conflicting point.
4. Assign owner and suspense for contradiction closure.

## Tool Packet Field Requirements

For each critical dependency, include:

- `validation_tier`
- `primary_source`
- `cross_check_source`
- `source_independence_rationale`
- `last_refresh_utc`
- `refresh_sla_minutes`
- `staleness_trigger`
- `contradiction_status`
- `approval_required`

## Authority and Escalation Mapping

- Align validation tier to approval needs in `warfighter-tool-authority-gates.md`.
- If authority or legal basis is uncertain, downgrade to advisory-only and require human command review.
- Document `approval_role` and `audit_record_id` for Tier 3 and Tier 4 recommendations.
