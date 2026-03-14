---
name: joint-role-3-medical-network-and-aeromedical-evac-cell
description: Support U.S. warfighter planning and decision support for Role 3 medical network operations and aeromedical evacuation. Use when missions require casualty flow balancing, blood and biologics continuity, and risk-aware patient movement decisions.
---

# Joint Role 3 Medical Network and Aeromedical Evac Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using current intent, enemy/system threats, operational constraints, and known assumptions.
2. Define measurable objectives, risk thresholds, branch conditions, and indicators that would invalidate the preferred plan.
3. Build a recommended option and at least two alternatives with explicit tradeoffs in tempo, survivability, sustainment load, and escalation risk.
4. Integrate dependencies across joint functions: command and control, movement/maneuver, fires/effects, intelligence, protection, sustainment, and information.
5. Convert the decision into execution-ready products with owners, suspense dates, coordination links, and required reports.

## Required Output Format

Deliver results in this order:

1. Situation snapshot: current conditions and key changes since the last update.
2. Recommended option: one clearly stated recommendation and rationale.
3. Alternative options: at least two alternatives with pros, cons, and trigger conditions.
4. Decision points: what must be decided now, later, or pre-delegated.
5. Staff tasking: who does what by when.

## Domain Products

Primary products for this skill: Role 3 bed and throughput posture board, aeromedical evacuation prioritization matrix, blood and biologics continuity packet.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: medical C2 platforms, patient movement systems, blood cold-chain monitors, route-threat fusion tools.

## External Tools and Protocol Integration

- Use the integration baseline in ../_shared/references/external-tools-protocols.md and select specific systems-of-record aligned to this mission.
- Use protocol examples in ../_shared/references/tool-protocol-playbooks.md to produce operator-ready tool invocation packets.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Use at least one primary source and one cross-check source before final recommendations.
- Prefer these protocol families for this skill: HL7/FHIR, USMTF, CoT, STIX/TAXII.
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.

## Mission Tool Authority Gates

- Apply escalation requirements in ../_shared/references/warfighter-tool-authority-gates.md for high-consequence recommendations.
- Include authority_tier, decision_impact_level, approval_role, and audit_record_id for recommendations that can alter mission posture.
- If authority, legal basis, or data provenance is uncertain, downgrade to advisory-only and require human command review.

## Cross-Domain Integration Playbook

- Use ../_shared/references/cross-domain-integration-playbook.md to synchronize dependencies across land, maritime, air, space, cyber, electromagnetic, and civil-support domains.
- Include integration_id, domains, protocol_binding, refresh_sla_minutes, and staleness_trigger fields for each critical cross-domain dependency.
- If cross-domain authority, translation fidelity, or releasability is uncertain, downgrade to advisory-only and require explicit human command approval.

## Mission Tool and Protocol Catalog Binding

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to select concrete tool suites and protocol stacks for this domain.
- Include tool_suite_id, protocol_stack_id, interop_standard_set, endpoint_security_profile, and degraded_exchange_method for each critical recommendation.
- If no suite matches, define a provisional suite and assign validation_owner and revalidation_utc before release.

## Domain Toolchain Defaults

- Primary: tool_suite_id=ts-role3-medical-aeromedical-network-v1 with protocol_stack_id=ps-role3-medical-aeromedical-network-stack-v1.
- Alternate: tool_suite_id=ts-contested-theater-blood-supply-and-biologics-assurance-v1 with protocol_stack_id=ps-contested-theater-blood-supply-and-biologics-assurance-stack-v1.
- Degraded: use authenticated voice/readback + UTC acknowledgment ledger + manual fallback board.

## Domain Packet Defaults

- Default packet IDs: DPL-ROLE3-AEROMED-001, DPL-BLOOD-BIOLOGICS-CONTINUITY-001.
- If no packet fully matches, define a provisional packet and assign a validation owner before release.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXII Addendum)

- Add tool_suite_id=ts-additive-pharma-authenticity-v1 + protocol_stack_id=ps-additive-pharma-authenticity-stack-v1 when casualty survival depends on accelerated verification of theater-manufactured pharmaceutical countermeasures.
- Add tool_suite_id=ts-coalition-missile-warning-shelter-sync-v1 + protocol_stack_id=ps-coalition-missile-warning-shelter-sync-stack-v1 when evacuation and bed management branches require synchronized civil warning posture under ballistic threat.
- Add packet_id=DPL-ADDITIVE-PHARMA-AUTH-001 and packet_id=DPL-COALITION-MISSILE-WARNING-SHELTER-001 for recommendations that alter medical routing, mass-casualty posture, or shelter-linked evacuation timing.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXIV Addendum)

- Add `tool_suite_id=ts-homeland-defense-pharma-biologics-cold-chain-assurance-v1` + `protocol_stack_id=ps-homeland-defense-pharma-biologics-cold-chain-assurance-stack-v1` when Role 3 continuity depends on resilient biologics and pharmaceutical chain integrity.
- Add `tool_suite_id=ts-joint-multi-theater-casualty-family-notification-integrity-v1` + `protocol_stack_id=ps-joint-multi-theater-casualty-family-notification-integrity-stack-v1` when casualty data integrity and family notification timing drive command decisions.
- Add `packet_id=DPL-HOMELAND-PHARMA-BIOLOGICS-COLDCHAIN-001` and `packet_id=DPL-JOINT-CASUALTY-FAMILY-NOTIFY-001` for clinical sustainment and notification-integrity branches.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXV Addendum)

- Prioritize `tool_suite_id=ts-joint-cislunar-logistics-interdiction-reconstitution-v1` with `protocol_stack_id=ps-joint-cislunar-logistics-interdiction-reconstitution-stack-v1` when strategic space logistics, custody confidence, or cislunar maneuver assurance directly affect mission risk decisions.
- Add `tool_suite_id=ts-theater-underwater-datacenter-cooling-grid-defense-v1` with `protocol_stack_id=ps-theater-underwater-datacenter-cooling-grid-defense-stack-v1` when mission outcomes depend on underwater compute resilience, cooling continuity, or cyber-physical load restoration.
- Add `packet_id=DPL-CISLUNAR-LOGISTICS-INTERDICTION-001` and `packet_id=DPL-UNDERWATER-DATACENTER-COOLING-DEFENSE-001` for recommendations that alter mission posture, contingency branches, or strategic continuity authorities.

## Domain Toolchain Override (2026-03-13, Expansion Wave XL Addendum)

- Add `tool_suite_id=ts-expeditionary-helicopter-brownout-drone-deconfliction-v1` + `protocol_stack_id=ps-expeditionary-helicopter-brownout-drone-deconfliction-stack-v1` when aeromedical lift or casualty pickup branches depend on landing-zone visibility and low-altitude UAS separation confidence.
- Add `tool_suite_id=ts-theater-underground-hospital-oxygen-power-continuity-v1` + `protocol_stack_id=ps-theater-underground-hospital-oxygen-power-continuity-stack-v1` when Role 3 survival depends on protected-facility oxygen, power, and casualty-load balancing.
- Add `tool_suite_id=ts-homeland-civil-nuclear-plant-grid-loss-military-support-v1` + `protocol_stack_id=ps-homeland-civil-nuclear-plant-grid-loss-military-support-stack-v1` when mass-casualty or radiological support decisions depend on synchronized DSCA cooling and public-protection actions.
- Add `packet_id=DPL-EXPEDITIONARY-HELICOPTER-BROWNOUT-DRONE-DECONFLICTION-001`, `packet_id=DPL-THEATER-UNDERGROUND-HOSPITAL-OXYGEN-POWER-001`, and `packet_id=DPL-HOMELAND-CIVIL-NUCLEAR-GRID-LOSS-MILSUP-001` for medical branches that materially alter survival posture, evacuation timing, or protected-facility continuity.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLI Addendum)

- Add `tool_suite_id=ts-coalition-medical-credential-revocation-reprivileging-v1` + `protocol_stack_id=ps-coalition-medical-credential-revocation-reprivileging-stack-v1` when Role 3 continuity depends on trusted coalition clinicians, emergency privileging, or revoked-access containment.
- Add `tool_suite_id=ts-joint-volcanic-ash-airbridge-engine-sortie-recovery-v1` + `protocol_stack_id=ps-joint-volcanic-ash-airbridge-engine-sortie-recovery-stack-v1` when aeromedical or critical-care airlift branches depend on ash-safe routing and engine inspection capacity.
- Add `tool_suite_id=ts-joint-contested-cellular-timing-holdover-first-responder-priority-v1` + `protocol_stack_id=ps-joint-contested-cellular-timing-holdover-first-responder-priority-stack-v1` when emergency medical coordination depends on resilient public-safety telecom timing and priority-service continuity.
- Add `packet_id=DPL-COALITION-MEDICAL-CREDENTIAL-REPRIVILEGING-001`, `packet_id=DPL-JOINT-VOLCANIC-ASH-AIRBRIDGE-ENGINE-RECOVERY-001`, and `packet_id=DPL-JOINT-CELLULAR-TIMING-HOLDOVER-FIRST-RESPONDER-001` for medical branches that materially alter survival posture, evacuation timing, or clinical continuity.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLII Addendum)

- Add `tool_suite_id=ts-expeditionary-pediatric-casualty-surge-v1` + `protocol_stack_id=ps-expeditionary-pediatric-casualty-surge-stack-v1` when Role 3 routing decisions depend on pediatric specialty balancing, child-capable bed availability, or contested transport sequencing.
- Add `tool_suite_id=ts-joint-command-voice-spoof-defense-v1` + `protocol_stack_id=ps-joint-command-voice-spoof-defense-stack-v1` when medevac, patient diversion, or casualty-notification decisions depend on trusted voice or media command paths.
- Add `packet_id=DPL-PEDS-CASUALTY-SURGE-001` and `packet_id=DPL-COMMAND-VOICE-SPOOF-001` for recommendations that materially change patient movement, bed allocation, or clinical command trust.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIV Addendum)

- Add `tool_suite_id=ts-expeditionary-burn-bed-transfer-blood-rotation-v1` + `protocol_stack_id=ps-expeditionary-burn-bed-transfer-blood-rotation-stack-v1` when survival depends on burn-bed availability, escharotomy capability, or blood-rotation timing across austere facilities.
- Add `tool_suite_id=ts-joint-tactical-edge-dataset-provenance-rollback-v1` + `protocol_stack_id=ps-joint-tactical-edge-dataset-provenance-rollback-stack-v1` when casualty-routing models, patient-priority datasets, or edge triage tools require provenance validation before movement decisions.
- Add `packet_id=DPL-BURN-BED-ESCHAROTOMY-TRANSFER-001` and `packet_id=DPL-TACTICAL-EDGE-DATASET-ROLLBACK-001` for recommendations that materially change burn transfer posture, transfusion prioritization, or trusted clinical data release.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLV Addendum)

- Add `tool_suite_id=ts-joint-civil-reserve-air-fleet-activation-v1` + `protocol_stack_id=ps-joint-civil-reserve-air-fleet-activation-stack-v1` when Role 3 continuity or casualty evacuation depends on reserve or commercial lift for patient movement, blood, or medical-supply surge.
- Add `tool_suite_id=ts-homeland-base-water-restart-biofilm-control-v1` + `protocol_stack_id=ps-homeland-base-water-restart-biofilm-control-stack-v1` when staging hospitals, aeromedical hubs, or treatment wards depend on safe potable-water restart before patient intake expansion.
- Add `tool_suite_id=ts-coalition-host-nation-civil-airlift-clearance-v1` + `protocol_stack_id=ps-coalition-host-nation-civil-airlift-clearance-stack-v1` when coalition patient movement depends on diplomatic clearances, mixed-crew civil aircraft, or host-nation ramp access.
- Add `packet_id=DPL-CIVIL-RESERVE-AIR-FLEET-001`, `packet_id=DPL-WATER-RESTART-BIOFILM-001`, and `packet_id=DPL-COALITION-CIVIL-AIRLIFT-CLEARANCE-001` for recommendations that materially change patient movement, facility release, or coalition aeromedical access posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVI Addendum)

- Add `tool_suite_id=ts-joint-austere-renal-support-dialysis-surge-v1` + `protocol_stack_id=ps-joint-austere-renal-support-dialysis-surge-stack-v1` when patient survival, bed balancing, or critical-care routing depends on dialysis capacity, renal consumables, or water purity.
- Add `tool_suite_id=ts-coalition-denied-sar-beacon-authentication-v1` + `protocol_stack_id=ps-coalition-denied-sar-beacon-authentication-stack-v1` when isolated casualty recovery or pickup-site validation depends on trusted coalition beacon authentication.
- Add `tool_suite_id=ts-joint-dispersed-airbase-mobile-precision-approach-lighting-v1` + `protocol_stack_id=ps-joint-dispersed-airbase-mobile-precision-approach-lighting-stack-v1` when night or low-visibility aeromedical recoveries depend on mobile precision-approach and lighting capability at dispersed airbases.
- Add `packet_id=DPL-AUSTERE-RENAL-DIALYSIS-001`, `packet_id=DPL-COALITION-SAR-BEACON-AUTH-001`, and `packet_id=DPL-MOBILE-PRECISION-APPROACH-001` for recommendations that materially alter patient movement, clinical survivability, or recovery-trust posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVIII Addendum)

- Add `tool_suite_id=ts-joint-austere-oxygen-generation-ventilator-load-shed-v1` + `protocol_stack_id=ps-joint-austere-oxygen-generation-ventilator-load-shed-stack-v1` when patient survival, bed balancing, or protected-facility continuity depends on oxygen generation and controlled ventilator prioritization.
- Add `tool_suite_id=ts-coalition-fuel-energy-water-nexus-anomaly-adjudication-v1` + `protocol_stack_id=ps-coalition-fuel-energy-water-nexus-anomaly-adjudication-stack-v1` when Role 3 continuity depends on whether fuel, power, or water anomalies at treatment nodes are temporary faults or broader infrastructure cascades.
- Add `tool_suite_id=ts-coalition-mission-data-releasability-waiver-adjudication-v1` + `protocol_stack_id=ps-coalition-mission-data-releasability-waiver-adjudication-stack-v1` when patient movement, bed reporting, or coalition clinical coordination depends on controlled release of medical or movement data across caveat boundaries.
- Add `packet_id=DPL-OXYGEN-VENTILATOR-LOADSHED-001`, `packet_id=DPL-FEW-NEXUS-ANOMALY-001`, and `packet_id=DPL-RELEASABILITY-WAIVER-001` for recommendations that materially alter patient movement, clinical survivability, or coalition medical-access posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave L Addendum)

- Add `tool_suite_id=ts-joint-forward-blood-bank-crossmatch-massive-transfusion-v1` + `protocol_stack_id=ps-joint-forward-blood-bank-crossmatch-massive-transfusion-stack-v1` when Role 3 continuity depends on blood availability, crossmatch throughput, or massive transfusion readiness.
- Add `packet_id=DPL-FORWARD-BLOOD-BANK-CROSSMATCH-001` for branches that materially alter blood resupply confidence, triage posture, or aeromedical evacuation timing.
