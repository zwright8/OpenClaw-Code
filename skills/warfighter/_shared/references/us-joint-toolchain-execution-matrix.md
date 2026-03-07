# U.S. Joint Toolchain Execution Matrix

Use this matrix to standardize external tool invocation and protocol choices across warfighter skills.

## Core Matrix Fields

- `tool_family`: Operational function (C2, ISR, cyber, logistics, medical, weather, coalition).
- `primary_system`: Mission-preferred system of record.
- `cross_check_system`: Independent source used to validate timeliness and integrity.
- `protocol_binding`: Exchange protocol (for example `USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, `NATO APP-11`, `OGC`, `REST`).
- `request_contract`: Required request fields and schema gate.
- `response_contract`: Expected response fields, confidence fields, and timestamp requirements.
- `degraded_mode`: Fallback tools and alternate transport path.
- `command_gate`: Required human validation step before execution when force posture or escalation risk can change.

## Domain-Aligned Toolchain Patterns

| tool_family | primary_system | cross_check_system | protocol_binding | request_contract minimum | response_contract minimum | degraded_mode |
| --- | --- | --- | --- | --- | --- | --- |
| Mission command/C2 | GCCS/JADC2 COP node | JOC staff tracker | USMTF / VMF | mission_id, op_phase, decision_window_utc, area_id | recommendation_id, effects_summary, confidence, refresh_utc | voice + USMTF fallback |
| ISR/targeting | collection manager + sensor tasking platform | all-source fusion board | CoT / STIX-TAXII / OGC | sensor_ids, target_set, priority, collection_window_utc | hit_quality, track_confidence, source_count, refresh_utc | manual retask worksheet |
| Fires/effects | digital fires coordination service | legal/ROE validation cell | VMF / Link 16 J-series | target_ref, cde_profile, roe_tag, timing | fire_option_set, deconfliction_status, confidence | voice confirmation + delayed fires branch |
| Cyber defense | SOC platform + incident orchestration | threat intel feed | STIX/TAXII / REST | asset_group, threat_tag, severity, action_window | mitigation_actions, residual_risk, evidence_refs, refresh_utc | local IR playbook |
| Logistics/sustainment | distribution planner | maintenance readiness board | USMTF / REST | cargo_id, route_id, required_by_utc, threat_level | route_status, bottleneck, eta_confidence | alternate node and convoy fallback |
| Medical support | medical C4I + patient movement tracker | casualty regulation board | HL7/FHIR bridge + USMTF | patient_flow_id, triage_state, evacuation_window | movement_plan, care_capability_gap, confidence | manual medevac board |
| Weather/environment | weather mission service | local sensor mesh | OGC / REST | area_id, mission_type, forecast_window | hazard_flags, confidence, sensor_integrity, refresh_utc | observer reports + degraded forecast |
| Coalition interoperability | releasability gateway | coalition liaison desk | APP-11 / STANAG / REST | release_tag, partner_set, product_id | releasability_status, caveats, ack_state | bilateral secure voice relay |

## Execution Protocol

1. Select `tool_family` and matching pattern from the table.
2. Validate request schema and credential scope before dispatch.
3. Execute primary request and immediate cross-check query.
4. Compare confidence, recency, and source divergence.
5. If divergence exceeds mission threshold, issue a degraded-mode recommendation and commander decision prompt.
6. Log `toolchain_execution_id`, protocol, acknowledgment status, and fallback activation.

## Required Handoff Fields

Every critical recommendation should include:

- `toolchain_execution_id`
- `tool_family`
- `primary_system`
- `cross_check_system`
- `protocol_binding`
- `request_contract_version`
- `response_contract_version`
- `ack_status`
- `fallback_activated`
- `command_gate_status`

## No-Go Conditions

Treat as no-go until command review when any condition is true:

- No primary source and no validated cross-check source.
- Timestamp stale beyond mission-defined threshold.
- Credential scope mismatch for intended action.
- Missing acknowledgment on critical fire, maneuver, or force-protection action.
