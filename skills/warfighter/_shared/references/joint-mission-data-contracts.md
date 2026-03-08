# Joint Mission Data Contracts (Warfighter)

Use this reference to enforce consistent machine-ingestible and commander-readable outputs across all warfighter skills.

## Required Contract Fields

- contract_id: stable identifier (`domain-purpose-v1`)
- mission_domain: land, air, maritime, cyber, space, EMSO, sustainment, medical, civil-support
- producer_system: source tool or system-of-record
- consumer_system: expected recipient system and echelon
- handling: classification/releasability caveat
- time_basis_utc: generation time and source observation windows
- geospatial_basis: WGS84 + optional MGRS/grid references
- confidence: numeric or ordinal scale plus rationale
- validation_status: pass, partial, fail with gate-level details

## Validation Gates

1. Schema gate: required keys present and typed correctly.
2. Freshness gate: source data within mission-defined staleness threshold.
3. Provenance gate: source system + extraction method recorded.
4. Consistency gate: no contradictory critical fields across fused sources.
5. Releasability gate: coalition/interagency disclosure rules applied.

## Mission Domain Profiles

- Mission command: decision, owner, suspense, branch_trigger, confidence
- ISR/targeting: source_id, collection_time_utc, georef, target_assessment, confidence
- Fires/airspace: mission_id, control_measure, conflict_flag, resolution_action, approval_status
- Logistics/mobility: commodity, quantity_on_hand, burn_rate, route_risk, delivery_eta
- Cyber/EMSO: incident_id, affected_system, mission_effect, containment_action, restore_eta
- Space/PNT/SATCOM: service_id, degraded_function, alternate_path, restore_eta, confidence
- Medical/personnel: casualty_category, pickup_site, destination, transport_status, survivability_window
- Civil-support/HA: support_request_id, affected_population, resource_gap, distribution_plan, partner_owner

## Interoperability Profiles

- Primary profile: full schema + machine payload + commander summary
- Alternate profile: reduced schema with retained decision-critical fields
- Degraded profile: manual packet with explicit confidence penalty and revalidation trigger

## Protocol Binding Guidance

- USMTF for formal operational reporting and commander-readable updates.
- VMF/Link 16/CoT for tactical dissemination where supported.
- STIX/TAXII for cyber threat exchanges and indicator movement.
- OGC services for geospatial overlays and feature synchronization.
- HL7/FHIR for medical movement and patient status interoperability.

## Contract Output Snippet

```json
{
  "contract_id": "airspace-deconfliction-v1",
  "mission_domain": "air",
  "producer_system": "tais-afatds-bridge",
  "consumer_system": "joint-fires-cell",
  "handling": "UNCLASSIFIED//FOUO",
  "time_basis_utc": "2026-03-06T20:00:00Z/2026-03-06T20:15:00Z",
  "confidence": "medium-high",
  "validation_status": "pass"
}
```
