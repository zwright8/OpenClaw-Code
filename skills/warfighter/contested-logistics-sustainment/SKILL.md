---
name: contested-logistics-sustainment
description: Plan sustainment under contested conditions. Use when designing resupply methods, pre-positioning, and distribution resilience for degraded or denied environments.
---

# Contested Logistics Sustainment

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: consumption rates, route threats, stock levels, transport assets.
2. Identify assumptions, decision thresholds, and what intelligence or reporting would invalidate the current plan.
3. Build primary and alternate options with explicit tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Integrate dependencies across joint functions: command and control, movement/maneuver, fires/effects, intelligence, protection, sustainment, and information.
5. Produce commander-facing outputs and a staff-action version with owners, suspense dates, and branch triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot: current conditions and key changes since last update.
2. Recommended option: one clearly stated recommendation and rationale.
3. Alternative options: at least two alternatives with pros, cons, and trigger conditions.
4. Decision points: what must be decided now, later, or pre-delegated.
5. Staff tasking: who does what by when.

## Domain Products

Primary products for this skill: sustainment posture plan, resupply branch options, critical-shortfall forecast.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: movement and distribution control systems, stockpile and consumption analytics, convoy and route risk dashboards.

## Protocol Profile

Preferred protocol families for this skill: USMTF, API/JSON, OGC.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-logistics-distribution-v1` with `protocol_stack_id=ps-joint-tactical-link-stack-v1`.
- Alternate: `tool_suite_id=ts-maritime-undersea-v1` with `protocol_stack_id=ps-geo-maritime-stack-v1`.
- Degraded: mission-essential sustainment board with manual reconciliation and scheduled command confirmations.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and name the exact tools selected for this mission set.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Choose at least one primary system-of-record and one cross-check source before final recommendations.
- State the protocol or message format for outbound coordination (for example `USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, or `OGC`).
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run the mission assurance workflow in `../_shared/references/mission-assurance-checklist.md` before final release.
- Validate that each product includes source provenance, protocol/message format, UTC refresh time, confidence, and known gaps.
- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Tool Invocation Contract

- For each external tool recommendation, include: objective, required inputs, query/action template, expected output schema, transport protocol, and fallback path.
- Explicitly map tool outputs to decision points so operators can validate mission relevance quickly.
- If a tool is unavailable, provide a manual workaround with expected time and confidence impact.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate classified sources, authorities, or approvals.

## Tool Protocol Playbooks

- Use protocol examples in ../_shared/references/tool-protocol-playbooks.md to produce operator-ready tool invocation packets.
- Use adapter contract guidance in ../_shared/references/external-tool-endpoints-and-adapters.md to define endpoint schemas, transport, and fallback behavior.
- Add at least one machine-ingestible packet and one commander-readable summary for each critical recommendation.

## Domain Tool Packet Library

- Use scenario packets in ../_shared/references/domain-tool-packet-library.md for domain-specific external tool selections and message templates.
- Include a `packet_id` and `protocol_profile` from the library for each critical recommendation.
- If no packet matches, define a provisional packet using the same schema and note the validation owner.

## Domain Data Contract

- Use mapping guidance in ../_shared/references/joint-mission-data-contracts.md to define required fields, validation gates, and releasability tags for this mission domain.
- Ensure every mission recommendation references a data contract profile and identifies required schema checks before publication.

## Operational Learning Loop

- Use `../_shared/references/operational-learning-and-after-action-loop.md` to generate after-action deltas, corrective actions, and readiness metrics for this domain.
- Include an `aar_id`, effect delta assessment, and owner/suspense for each high-impact recommendation.
- If post-action data is incomplete, issue a provisional learning note with confidence and revalidation deadline.

## Readiness Certification Evidence Pack

- Use `../_shared/references/readiness-certification-evidence-pack.md` to define mission-essential task evidence, evaluator triggers, and certification confidence scoring.
- Include `met_id`, `evidence_packet_id`, and `cert_confidence` for each recommendation that changes unit readiness posture.
- If required evidence is missing, mark status as `provisional` and assign closure actions with suspense.

## Protocol Execution Sequence

- Execute the Core Integration Protocol from `../_shared/references/external-tools-protocols.md` as an explicit step sequence, not as guidance only.
- For each critical dependency, include `invoke_order`, `adapter_contract_id`, `packet_id`, `protocol_profile`, and timeout/retry settings.
- Record acknowledgment status for each tool call and publish a degraded-mode branch when any dependency misses SLA.
- Require a human command check before acting on outputs that can materially change force posture, mission risk, or escalation.

## Domain Toolchain Profile Binding

- Use `../_shared/references/domain-toolchain-profiles.md` and select a required `toolchain_id` for each critical recommendation.
- Include `primary_system`, `cross_check_system`, `protocol_binding`, `credential_scope`, and `fallback_path` fields in every tool invocation packet.
- Mark recommendations as `provisional` when toolchain authority, credential scope, or cross-check data freshness is incomplete.

## Tool Health and Trust Monitoring

- Use `../_shared/references/tool-health-and-trust-monitoring.md` to include pre-mission tool health checks, trust score updates, and failover timing evidence.
- Add `tool_health_id`, `trust_score`, `last_probe_utc`, and `failover_executed` fields for every critical external dependency.
- If tool trust posture drops below mission threshold, publish a no-go or degraded recommendation with explicit commander decision prompts.

## U.S. Joint Protocol Assurance Drill

- Use `../_shared/references/us-joint-protocol-assurance-drill.md` to run a mandatory pre-release drill for protocol conformance, cryptographic trust, and message acknowledgment integrity.
- Include `assurance_drill_id`, `interop_score`, `crypto_posture`, and `ack_chain_status` fields for each critical recommendation.
- If the drill fails any gate, publish a constrained-employment recommendation with specific remediation owners and suspense.

## Joint Operations External Toolchain Profiles

- Use `../_shared/references/joint-operations-external-toolchain-profiles.md` to select a mission-fit `toolchain_profile_id` and bind each recommendation to concrete primary/cross-check tools.
- Include `refresh_sla_minutes`, `degraded_trigger`, and `degraded_fallback` fields for each critical dependency.
- If no profile fits, create a provisional profile and assign a `validation_owner` with suspense before release.

## Human-Agent Command Escalation Matrix

- Use `../_shared/references/human-agent-command-escalation-matrix.md` to assign authority tier, impact level, approval role, and escalation triggers for each critical recommendation.
- Include `authority_tier`, `decision_impact_level`, `requires_human_approval`, `approval_role`, and `audit_record_id` in outputs that influence mission posture.
- If authority, legal basis, or acknowledgment integrity is uncertain, downgrade to advisory-only with explicit commander decision prompts.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter mission posture.
- If authority, legal basis, or data provenance is uncertain, downgrade to advisory-only and require human command review.

## Cross-Domain Integration Playbook

- Use `../_shared/references/cross-domain-integration-playbook.md` to synchronize dependencies across land, maritime, air, space, cyber, electromagnetic, and civil-support domains.
- Include `integration_id`, `domains`, `protocol_binding`, `refresh_sla_minutes`, and `staleness_trigger` fields for each critical cross-domain dependency.
- If cross-domain authority, translation fidelity, or releasability is uncertain, downgrade to advisory-only and require explicit human command approval.

## Mission Tool and Protocol Catalog Binding

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select concrete tool suites and protocol stacks for this domain.
- Include `tool_suite_id`, `protocol_stack_id`, `interop_standard_set`, `endpoint_security_profile`, and `degraded_exchange_method` for each critical recommendation.
- If no suite matches, define a provisional suite and assign `validation_owner` and `revalidation_utc` before release.

## Domain Packet Defaults

- Default packet IDs: `DPL-PORT-REPAIR-001`, `DPL-INTERMODAL-RAIL-AIR-001`, `DPL-FUEL-LEAK-ATTRIB-001`.
- If no packet fully matches, define a provisional packet and assign a validation owner before release.

## Operational Execution Hardening

- Enforce `ack_chain_status=verified` for all mission-critical tool exchanges before recommending posture changes.
- Require `trust_score >= 0.80` on each primary external dependency; if lower, elevate alternate stack and mark outputs `provisional`.
- Add explicit degraded-mode triggers: stale data beyond `refresh_sla_minutes`, missing cryptographic validation, or failed human approval gate.
- Include a final command-ready line: `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` with rationale tied to authority and protocol checks.

## Logistics Continuity Addendum (2026-03-08)

- For Arctic or littoral denial scenarios, bind `tool_suite_id=ts-under-ice-resupply-v1` with `protocol_stack_id=ps-under-ice-resupply-stack-v1`.
- For strategic sealift availability stress, add `tool_suite_id=ts-maritime-insurance-reconstitution-v1` with `protocol_stack_id=ps-maritime-insurance-reconstitution-stack-v1`.
- For sustainment plans with life-support dependencies, include `packet_id=DPL-RARE-BLOOD-MATCH-001` as a mandatory medical-logistics cross-check.

## Logistics Continuity Addendum (2026-03-08, Fuel and Critical Cargo Integrity)

- Add `tool_suite_id=ts-denied-fuel-bladder-integrity-v1` + `protocol_stack_id=ps-denied-fuel-bladder-integrity-stack-v1` for forward fuel-storage reliability and sabotage detection.
- Add `packet_id=DPL-CRITICAL-MINERAL-SHIPPING-001` when sustainment courses of action depend on strategic material flow continuity.
- Add `packet_id=DPL-MICROREACTOR-EMPLOY-001` when expeditionary power constraints materially change sustainment branch feasibility.

## Logistics Continuity Addendum (2026-03-08, Signature and Feedstock Integrity)

- Add `tool_suite_id=ts-logistics-signature-masking-v1` + `protocol_stack_id=ps-logistics-signature-masking-stack-v1` when convoy detectability is a primary sustainment risk.
- Add `packet_id=DPL-ADDITIVE-FEEDSTOCK-AUTH-001` for sustainment plans that rely on additive repair or microfactory throughput.
- Add `packet_id=DPL-SEMICONDUCTOR-FAB-CONTINGENCY-001` when strategic electronics shortages can cascade into theater sustainment delays.

## Logistics Continuity Addendum (2026-03-10, Port Recovery and Rail Priority Merge)

- Add `tool_suite_id=ts-port-crane-cyber-physical-recovery-v1` + `protocol_stack_id=ps-port-crane-cyber-physical-recovery-stack-v1` when sustainment throughput depends on contested port crane restoration and OT safety controls.
- Add `tool_suite_id=ts-civil-rail-evac-priority-merge-v1` + `protocol_stack_id=ps-civil-rail-evac-priority-merge-stack-v1` when military sustainment movement must be synchronized with life-safety rail evacuation demand.
- Add `packet_id=DPL-PORT-CRANE-CYBER-PHYSICAL-RECOVERY-001` and `packet_id=DPL-CIVIL-RAIL-EVAC-PRIORITY-MERGE-001` for sustainment branches that alter port unloading cadence, rail throughput, or distribution sequencing.

## Logistics Continuity Addendum (2026-03-12, Arctic Rescue, Munitions Safety, and Coalition Cascade Response)

- Add `tool_suite_id=ts-arctic-sar-medical-auth-v1` + `protocol_stack_id=ps-arctic-sar-medical-auth-stack-v1` when sustainment plans include contested Arctic personnel recovery and hypothermia-driven casualty routing.
- Add `tool_suite_id=ts-munitions-energetics-dispersal-v1` + `protocol_stack_id=ps-munitions-energetics-dispersal-stack-v1` when munitions safety compatibility and depot dispersal timing drive sustainment feasibility.
- Add `tool_suite_id=ts-coalition-infra-cyber-kinetic-cascade-v1` + `protocol_stack_id=ps-coalition-infra-cyber-kinetic-cascade-stack-v1` when sustainment continuity depends on coalition infrastructure restoration after cyber-kinetic shocks.
- Add `packet_id=DPL-ARCTIC-SAR-MEDAUTH-001`, `packet_id=DPL-MUNITIONS-ENERGETICS-DISPERSAL-001`, and `packet_id=DPL-COALITION-CYBER-KINETIC-CASCADE-001` for branches that materially change throughput confidence, life-support posture, or mission sustainment viability.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXIV Addendum)

- Add `tool_suite_id=ts-theater-autonomous-fortification-print-farm-v1` + `protocol_stack_id=ps-theater-autonomous-fortification-print-farm-stack-v1` when contested sustainment must prioritize distributed fortification and engineer support output.
- Add `tool_suite_id=ts-strategic-rare-gas-energetic-precursor-allocation-v1` + `protocol_stack_id=ps-strategic-rare-gas-energetic-precursor-allocation-stack-v1` when sustainment feasibility depends on energetic precursor flow assurance.
- Add `packet_id=DPL-THEATER-FORTIFICATION-PRINTFARM-001` and `packet_id=DPL-STRATEGIC-RAREGAS-ENERGETICS-002` for logistics branches that hinge on industrial throughput confidence.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXV Addendum)

- Prioritize `tool_suite_id=ts-joint-cislunar-logistics-interdiction-reconstitution-v1` with `protocol_stack_id=ps-joint-cislunar-logistics-interdiction-reconstitution-stack-v1` when strategic space logistics, custody confidence, or cislunar maneuver assurance directly affect mission risk decisions.
- Add `tool_suite_id=ts-theater-underwater-datacenter-cooling-grid-defense-v1` with `protocol_stack_id=ps-theater-underwater-datacenter-cooling-grid-defense-stack-v1` when mission outcomes depend on underwater compute resilience, cooling continuity, or cyber-physical load restoration.
- Add `packet_id=DPL-CISLUNAR-LOGISTICS-INTERDICTION-001` and `packet_id=DPL-UNDERWATER-DATACENTER-COOLING-DEFENSE-001` for recommendations that alter mission posture, contingency branches, or strategic continuity authorities.

## Domain Toolchain Override (2026-03-13, Expansion Wave XL Addendum)

- Add `tool_suite_id=ts-coalition-merchant-marine-crew-vetting-sealift-assurance-v1` + `protocol_stack_id=ps-coalition-merchant-marine-crew-vetting-sealift-assurance-stack-v1` when sustainment viability depends on merchant crew trust, sanctions compliance, or coalition sealift release timing.
- Add `tool_suite_id=ts-strategic-contested-lng-bunker-fleet-fuel-allocation-v1` + `protocol_stack_id=ps-strategic-contested-lng-bunker-fleet-fuel-allocation-stack-v1` when contested maritime fuel access and bunkering confidence determine sustainment feasibility.
- Add `tool_suite_id=ts-strategic-commercial-port-crane-firmware-rollback-sealift-recovery-v1` + `protocol_stack_id=ps-strategic-commercial-port-crane-firmware-rollback-sealift-recovery-stack-v1` when port OT recovery and berth release directly constrain theater throughput.
- Add `tool_suite_id=ts-theater-rapid-temporary-bridge-uas-inspection-release-v1` + `protocol_stack_id=ps-theater-rapid-temporary-bridge-uas-inspection-release-stack-v1` when force-flow branches depend on rapid bridge release and structural-confidence restoration.
- Add `packet_id=DPL-COALITION-MERCHANT-MARINE-CREW-VETTING-SEALIFT-001`, `packet_id=DPL-STRATEGIC-LNG-BUNKER-FLEET-FUEL-ALLOCATION-001`, `packet_id=DPL-STRATEGIC-PORT-CRANE-FIRMWARE-ROLLBACK-SEALIFT-001`, and `packet_id=DPL-THEATER-TEMPORARY-BRIDGE-UAS-RELEASE-001` for sustainment branches that materially alter throughput confidence or mission feasibility.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLI Addendum)

- Add `tool_suite_id=ts-strategic-domestic-transport-chokepoint-reroute-v1` + `protocol_stack_id=ps-strategic-domestic-transport-chokepoint-reroute-stack-v1` when homeland transport failures materially alter theater sustainment timelines or reception and onward movement confidence.
- Add `tool_suite_id=ts-expeditionary-autonomous-sustainment-routing-drift-governance-v1` + `protocol_stack_id=ps-expeditionary-autonomous-sustainment-routing-drift-governance-stack-v1` when convoy viability depends on autonomy trust, telemetry confidence, or route drift containment.
- Add `tool_suite_id=ts-strategic-shipyard-drydock-power-water-cyber-restoration-v1` + `protocol_stack_id=ps-strategic-shipyard-drydock-power-water-cyber-restoration-stack-v1` when fleet repair throughput and maritime sustainment depend on drydock utilities and OT recovery.
- Add `tool_suite_id=ts-theater-river-port-dredge-barge-roro-sustainment-v1` + `protocol_stack_id=ps-theater-river-port-dredge-barge-roro-sustainment-stack-v1` when inland-waterway cargo flow, channel depth, or transload timing drives sustainment feasibility.
- Add `packet_id=DPL-STRATEGIC-DOMESTIC-TRANSPORT-CHOKEPOINT-REROUTE-001`, `packet_id=DPL-EXPEDITIONARY-AUTONOMOUS-SUSTAINMENT-ROUTING-DRIFT-001`, `packet_id=DPL-STRATEGIC-SHIPYARD-DRYDOCK-RESTORATION-001`, and `packet_id=DPL-THEATER-RIVER-PORT-DREDGE-BARGE-RORO-001` for sustainment branches that materially alter throughput confidence or mission feasibility.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLII Addendum)

- Add `tool_suite_id=ts-coalition-allied-depot-sabotage-wargame-v1` + `protocol_stack_id=ps-coalition-allied-depot-sabotage-wargame-stack-v1` when sustainment viability depends on depot survivability, stock relocation, or host-nation recovery branches.
- Add `tool_suite_id=ts-strategic-economic-coercion-logistics-warning-v1` + `protocol_stack_id=ps-strategic-economic-coercion-logistics-warning-stack-v1` when route, carrier, supplier, or insurer coercion indicators can fracture distribution plans before physical disruption is visible.
- Add `tool_suite_id=ts-strategic-launch-counterfeit-microelectronics-v1` + `protocol_stack_id=ps-strategic-launch-counterfeit-microelectronics-stack-v1` when logistics confidence depends on trusted electronics pedigree for critical launch, C2, or sustainment systems.
- Add `packet_id=DPL-DEPOT-SABOTAGE-WARGAME-001`, `packet_id=DPL-ECON-COERCION-LOGISTICS-001`, and `packet_id=DPL-LAUNCH-COUNTERFEIT-MICRO-001` for branches that materially alter throughput, reconstitution timing, or commander risk acceptance.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIII Addendum)

- Add `tool_suite_id=ts-theater-bulk-industrial-gas-oxygen-priority-v1` + `protocol_stack_id=ps-theater-bulk-industrial-gas-oxygen-priority-stack-v1` when sustainment viability depends on bulk gas purity, refill capacity, or contested transport to medical and maintenance nodes.
- Add `tool_suite_id=ts-strategic-harbor-tug-pilotage-sealift-priority-v1` + `protocol_stack_id=ps-strategic-harbor-tug-pilotage-sealift-priority-stack-v1` when tug and pilotage scarcity becomes the limiting factor for sealift throughput.
- Add `tool_suite_id=ts-homeland-defense-specialty-lubricant-hydraulic-fluid-allocation-v1` + `protocol_stack_id=ps-homeland-defense-specialty-lubricant-hydraulic-fluid-allocation-stack-v1` when specialty-fluid shortages or contamination directly constrain mission-capable rates and depot output.
- Add `packet_id=DPL-INDUSTRIAL-GAS-OXYGEN-PRIORITY-001`, `packet_id=DPL-HARBOR-TUG-PILOTAGE-SEALIFT-001`, and `packet_id=DPL-LUBRICANT-HYDRAULIC-ALLOCATION-001` for branches that materially alter sustainment throughput, life-support posture, or commander risk acceptance.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIV Addendum)

- Add `tool_suite_id=ts-strategic-photonics-laser-optics-allocation-v1` + `protocol_stack_id=ps-strategic-photonics-laser-optics-allocation-stack-v1` when sustainment feasibility depends on scarce EO materials for sensors, laser systems, or electro-optical repair.
- Add `tool_suite_id=ts-homeland-rail-hazmat-military-priority-deconfliction-v1` + `protocol_stack_id=ps-homeland-rail-hazmat-military-priority-deconfliction-stack-v1` when rail dispatch must reconcile military throughput with hazardous-material controls and civil emergency constraints.
- Add `tool_suite_id=ts-joint-airbase-arresting-gear-runway-cable-reconstitution-v1` + `protocol_stack_id=ps-joint-airbase-arresting-gear-runway-cable-reconstitution-stack-v1` when airbase sustainment, sortie recovery, or runway-end cable integrity becomes the bottleneck for operational tempo.
- Add `packet_id=DPL-PHOTONICS-LASER-OPTICS-ALLOCATION-001`, `packet_id=DPL-RAIL-HAZMAT-MILPRIORITY-DECONFLICTION-001`, and `packet_id=DPL-ARRESTING-GEAR-RUNWAY-CABLE-001` for branches that materially alter sustainment throughput, sortie regeneration, or commander risk acceptance.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVI Addendum)

- Add `tool_suite_id=ts-strategic-fuel-additive-adulteration-interdiction-v1` + `protocol_stack_id=ps-strategic-fuel-additive-adulteration-interdiction-stack-v1` when sustainment viability depends on trusted fuel-additive pedigree, contamination quarantine, or substitute blending decisions.
- Add `tool_suite_id=ts-expeditionary-high-latitude-battery-thermal-survivability-v1` + `protocol_stack_id=ps-expeditionary-high-latitude-battery-thermal-survivability-stack-v1` when cold-soaked batteries, charging windows, or low-insolation power limits threaten logistics nodes and autonomous sustainment.
- Add `tool_suite_id=ts-autonomous-breach-soil-bearing-route-classification-v1` + `protocol_stack_id=ps-autonomous-breach-soil-bearing-route-classification-stack-v1` when engineer or heavy-vehicle throughput depends on trusted soil-bearing classifications before route release.
- Add `packet_id=DPL-FUEL-ADDITIVE-ADULTERATION-001`, `packet_id=DPL-HIGH-LATITUDE-BATTERY-THERMAL-001`, and `packet_id=DPL-BREACH-SOIL-BEARING-001` for branches that materially alter sustainment throughput, energy continuity, or route-release confidence.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVIII Addendum)

- Add `tool_suite_id=ts-theater-autonomous-decoy-economy-inventory-governance-v1` + `protocol_stack_id=ps-theater-autonomous-decoy-economy-inventory-governance-stack-v1` when sustainment survivability depends on pacing decoy expenditure, regeneration, or deception coverage across logistics nodes.
- Add `tool_suite_id=ts-coalition-fuel-energy-water-nexus-anomaly-adjudication-v1` + `protocol_stack_id=ps-coalition-fuel-energy-water-nexus-anomaly-adjudication-stack-v1` when contested sustainment depends on distinguishing sabotage, utility cascade, or distribution failure across fuel, power, and water systems.
- Add `tool_suite_id=ts-joint-aerial-port-battery-hazmat-pallet-integrity-v1` + `protocol_stack_id=ps-joint-aerial-port-battery-hazmat-pallet-integrity-stack-v1` when throughput depends on safe release of battery cargo, hazmat consignments, or palletized sustainment loads.
- Add `packet_id=DPL-AUTONOMOUS-DECOY-ECONOMY-001`, `packet_id=DPL-FEW-NEXUS-ANOMALY-001`, and `packet_id=DPL-AERIAL-PORT-HAZMAT-PALLET-001` for branches that materially alter sustainment survivability, utility continuity, or air-logistics throughput.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIX Addendum)

- Add `tool_suite_id=ts-strategic-undersea-cable-repair-ship-escort-priority-v1` + `protocol_stack_id=ps-strategic-undersea-cable-repair-ship-escort-priority-stack-v1` when sustainment C2, reroute authority, or distribution continuity depends on restoring contested cable infrastructure.
- Add `tool_suite_id=ts-theater-offshore-energy-platform-blackstart-defense-v1` + `protocol_stack_id=ps-theater-offshore-energy-platform-blackstart-defense-stack-v1` when sustainment viability depends on offshore power, fuel, or maritime energy-node restart sequencing.
- Add `packet_id=DPL-CABLE-REPAIR-SHIP-ESCORT-001` and `packet_id=DPL-OFFSHORE-ENERGY-BLACKSTART-001` for branches that materially alter distribution confidence, energy continuity, or commander sustainment risk acceptance.

## Domain Toolchain Override (2026-03-14, Expansion Wave L Addendum)

- Add `tool_suite_id=ts-theater-fuel-pier-hose-farm-bulk-transfer-bypass-restoration-v1` + `protocol_stack_id=ps-theater-fuel-pier-hose-farm-bulk-transfer-bypass-restoration-stack-v1` when sustainment viability depends on contested maritime fuel throughput, pier restoration timing, or hose-farm contamination control.
- Add `tool_suite_id=ts-joint-forward-blood-bank-crossmatch-massive-transfusion-v1` + `protocol_stack_id=ps-joint-forward-blood-bank-crossmatch-massive-transfusion-stack-v1` when logistics branches depend on blood cold-chain endurance, crossmatch throughput, or casualty-surge survival support.
- Add `packet_id=DPL-FUEL-PIER-BYPASS-001` and `packet_id=DPL-FORWARD-BLOOD-BANK-CROSSMATCH-001` for branches that materially alter fuel flow, medical sustainment, or contested distribution confidence.

## Domain Toolchain Override (2026-03-14, Expansion Wave LI Addendum)

- Add `tool_suite_id=ts-coalition-maritime-insurance-sanctions-and-convoy-underwriting-cell-v1` + `protocol_stack_id=ps-coalition-maritime-insurance-sanctions-and-convoy-underwriting-cell-stack-v1` when sustainment viability depends on convoy underwriting, sanctions compliance, or commercial carrier confidence.
- Add `tool_suite_id=ts-coalition-cross-border-battery-recycling-and-critical-mineral-recovery-cell-v1` + `protocol_stack_id=ps-coalition-cross-border-battery-recycling-and-critical-mineral-recovery-cell-stack-v1` when logistics endurance depends on mineral reclamation throughput, coalition recovery capacity, or battery feedstock custody.
- Add `tool_suite_id=ts-theater-hydrogen-fuel-cell-microgrid-safety-and-emissions-control-cell-v1` + `protocol_stack_id=ps-theater-hydrogen-fuel-cell-microgrid-safety-and-emissions-control-cell-stack-v1` when forward sustainment nodes depend on hydrogen microgrid safety, leak containment, or emissions-aware power continuity.
- Add `packet_id=DPL-MARITIME-INSURANCE-UNDERWRITE-001`, `packet_id=DPL-BATTERY-RECYCLING-MINERAL-RECOVERY-001`, and `packet_id=DPL-HYDROGEN-MICROGRID-SAFETY-001` for branches that materially alter throughput confidence, industrial endurance, or energy continuity.

## Domain Toolchain Override (2026-03-14, Expansion Wave LII Addendum)

- Add `tool_suite_id=ts-theater-petroleum-quality-lab-fuel-spec-waiver-v1` + `protocol_stack_id=ps-theater-petroleum-quality-lab-fuel-spec-waiver-stack-v1` when sustainment viability depends on assay confidence, platform tolerance, or commander-approved use of marginal fuel lots.
- Add `tool_suite_id=ts-joint-fuel-bladder-grounding-bonding-lightning-safety-v1` + `protocol_stack_id=ps-joint-fuel-bladder-grounding-bonding-lightning-safety-stack-v1` when fuel flow depends on weather hold decisions, grounding discipline, or expeditionary transfer safety at forward fuel points.
- Add `packet_id=DPL-PETROLEUM-LAB-SPEC-WAIVER-001` and `packet_id=DPL-FUEL-BLADDER-LIGHTNING-001` for branches that materially alter fuel-release confidence, throughput timing, or sustainment safety posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave LIV Addendum)

- Add `tool_suite_id=ts-strategic-electronics-salvage-critical-component-reclamation-v1` + `protocol_stack_id=ps-strategic-electronics-salvage-critical-component-reclamation-stack-v1` when sustainment throughput depends on reclaiming trusted electronics faster than new procurement can restore inventories.
- Add `tool_suite_id=ts-coalition-host-nation-water-rights-military-demand-deconfliction-v1` + `protocol_stack_id=ps-coalition-host-nation-water-rights-military-demand-deconfliction-stack-v1` when sustainment feasibility depends on water allocation legitimacy and avoiding host-nation backlash against military demand.
- Add `tool_suite_id=ts-joint-captured-enemy-materiel-exploitation-safe-redistribution-v1` + `protocol_stack_id=ps-joint-captured-enemy-materiel-exploitation-safe-redistribution-stack-v1` when captured enemy stocks or components can bridge contested shortages if safety and legal gates are met.
- Add `packet_id=DPL-ELECTRONICS-SALVAGE-RECLAMATION-001`, `packet_id=DPL-WATER-RIGHTS-DECONFLICTION-001`, and `packet_id=DPL-CAPTURED-ENEMY-MATERIEL-001` for branches that materially alter sustainment throughput, legitimacy, or reuse confidence.

## Domain Toolchain Override (2026-03-14, Expansion Wave LV Addendum)

- Use `coalition-fuel-truck-driver-vetting-and-bulk-fuel-shift-restoration-cell` when sustainment viability depends on vetted tanker-driver availability, insider-risk controls, or coalition dispatch recovery across bulk-fuel nodes.
- Use `joint-deployed-pay-entitlement-fraud-and-disconnected-disbursement-cell` when commander sustainment risk depends on trusted pay delivery, entitlement integrity, or disconnected disbursement continuity for forward personnel.
