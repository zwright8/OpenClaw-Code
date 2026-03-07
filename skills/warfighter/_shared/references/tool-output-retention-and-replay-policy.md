# Tool Output Retention and Replay Policy

Use this policy when mission outputs depend on external tool queries and system integrations.

## Retention Baseline

1. Retain machine-ingestible tool output packets for mission-critical recommendations for at least the current operation plus after-action window.
2. Preserve key fields at minimum: tool identifier, query template version, input bounds, output hash, retrieval timestamp (UTC), and operator/audit ID.
3. Store an immutable digest for each packet to detect tampering between recommendation and execution.

## Replay Requirements

1. Re-run critical packets when confidence drops below threshold, data freshness exceeds SLA, or commander requests validation.
2. Use original input bounds first, then run bounded delta updates for changed AOI, time window, or authority scope.
3. Record replay disposition: matched, drifted, or conflicting; include mission impact and recommended action.

## Drift Controls

1. If replay output drifts materially from retained output, mark recommendation `provisional` pending human review.
2. Trigger escalation when drift touches target identity, force posture, weapon-system status, or legal/ROE-relevant facts.
3. Capture a short causality note (sensor outage, schema change, adversary deception, or model/tool update).

## Minimum Output Fields

Include these fields for each critical dependency:

- `retention_packet_id`
- `packet_hash`
- `retention_store`
- `replay_required`
- `replay_status`
- `drift_assessment`
- `replay_owner`
- `replay_suspense_utc`

## Governance

- Do not allow automation-only execution when replay status is `conflicting`.
- Require command approval for release when replay evidence is missing or stale beyond mission threshold.
- Keep recommendations advisory-only if retention or replay controls cannot be completed.
