# Cross-Domain Effects Ledger

Track second-order and third-order mission effects across domains so commander decisions remain synchronized under contested conditions.

## Ledger schema

- `effect_id`: unique effect identifier
- `trigger_action`: decision or event that starts the effect chain
- `origin_domain`: land, air, maritime, space, cyber, electromagnetic, information, sustainment, medical, legal/policy
- `affected_domains`: list of downstream domains affected
- `effect_window_utc`: expected start and end window
- `severity`: low, moderate, high, critical
- `confidence`: low, medium, high
- `detection_signal`: telemetry or indicator that confirms onset
- `owner_cell`: responsible staff cell
- `required_report_format`: USMTF, VMF, Link 16, CoT, STIX/TAXII, OGC, or approved local format
- `fallback_comms`: alternate comms path if primary transport fails

## Operational protocol

1. Add at least one cross-domain effect entry for each recommended COA.
2. Mark effects that can trigger escalation, civilian harm risk, or coalition releasability issues.
3. Assign owner and suspense for each mitigation action.
4. Publish ledger updates with UTC timestamps and provenance.
5. Revalidate entries when major assumptions change or tools degrade.
