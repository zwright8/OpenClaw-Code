---
name: strategic-industrial-mobilization-readiness-cell
description: Support U.S. warfighter planning and decision support for Strategic Industrial Mobilization Readiness Cell. Use when missions require industrial mobilization readiness analysis for surge production, repair throughput, and supply bottlenecks, integrated options, and protocol-aware staff outputs.
---

# Strategic Industrial Mobilization Readiness Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: commander objectives, force disposition, operating constraints, and key intelligence gaps.
2. Identify assumptions, decision thresholds, and what reporting or indicators would invalidate the current plan.
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

Primary products for this skill: surge production readiness dashboard, bottleneck mitigation plan, mobilization decision brief.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and name the exact tools selected for this mission set.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Prioritize these tools or protocol families for this domain: industrial base monitors, maintenance readiness systems, logistics ERP tools.
- State the protocol or message format for outbound coordination (for example API/JSON, USMTF, NATO APP-11/ADatP-3).
- Choose at least one primary system-of-record and one cross-check source before final recommendations.
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


## Domain Toolchain Override (2026-03-08, Critical Mineral Denial Expansion)

- Prioritize `tool_suite_id=ts-critical-mineral-denial-mitigation-v1` with `protocol_stack_id=ps-industrial-mobilization-stack-v1` when readiness risk is driven by rare-earth or critical mineral constraints.
- Use packet `DPL-RARE-EARTH-001` to frame denial impact forecast, substitution options, and stockpile burn-rate controls.
- If supply-source validation is incomplete, publish advisory-only mitigation options and assign validation owner with suspense.

## Domain Toolchain Override (2026-03-08, Field Biologics Resilience Expansion)

- Prioritize `tool_suite_id=ts-field-biologics-assurance-v1` when biologics shortages or contamination risk threatens force-readiness timelines.
- Use packet `DPL-BIOREACTOR-VAX-001` to map lot assurance, contamination controls, and distribution continuity triggers.
- If assay chain confidence is incomplete, downgrade to contingency-only readiness guidance and require medical authority review.

## Domain Toolchain Override (2026-03-10, Rare-Earth Recovery and Rail Node Restoration Addendum)

- Prioritize `tool_suite_id=ts-rare-earth-processing-sabotage-recovery-v1` + `protocol_stack_id=ps-rare-earth-processing-sabotage-recovery-stack-v1` when industrial mobilization readiness depends on restoring disrupted rare-earth processing throughput.
- Prioritize `tool_suite_id=ts-critical-rail-node-cyber-physical-restoration-v1` + `protocol_stack_id=ps-critical-rail-node-cyber-physical-restoration-stack-v1` when force-flow readiness is constrained by rail chokepoint cyber-physical disruption.
- Add `packet_id=DPL-RARE-EARTH-SABOTAGE-RECOVERY-001` and `packet_id=DPL-CRITICAL-RAIL-NODE-CYBER-PHYSICAL-RESTORE-001` for high-impact industrial and mobility restoration branches.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXII Addendum)

- Add tool_suite_id=ts-reserve-cannibalization-governance-v1 + protocol_stack_id=ps-reserve-cannibalization-governance-stack-v1 when industrial readiness recommendations depend on temporary component cannibalization and controlled restoration sequencing.
- Add tool_suite_id=ts-additive-pharma-authenticity-v1 + protocol_stack_id=ps-additive-pharma-authenticity-stack-v1 when mobilization branches include medical countermeasure surge with strict authenticity gating.
- Add packet_id=DPL-RESERVE-CANNIBALIZATION-GOVERNANCE-001 and packet_id=DPL-ADDITIVE-PHARMA-AUTH-001 for recommendations that alter depot priorities, workforce load plans, or release authority posture.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXIII Addendum)

- Add `tool_suite_id=ts-orbital-servicing-refuel-assurance-v1` + `protocol_stack_id=ps-orbital-servicing-refuel-assurance-stack-v1` when recommendations depend on contested space-logistics servicing continuity, custody confidence, or maneuver-safe refuel timing.
- Add `tool_suite_id=ts-denied-terrain-drone-resupply-nav-v1` + `protocol_stack_id=ps-denied-terrain-drone-resupply-nav-stack-v1` when branch viability depends on autonomous resupply route confidence through denied terrain.
- Add `tool_suite_id=ts-coalition-cable-landing-data-sovereignty-v1` + `protocol_stack_id=ps-coalition-cable-landing-data-sovereignty-stack-v1` when recommendations depend on sovereign data routing, coalition caveats, or cable-landing continuity.
- Add `tool_suite_id=ts-runway-ice-fog-autoland-assurance-v1` + `protocol_stack_id=ps-runway-ice-fog-autoland-assurance-stack-v1` when mission tempo is constrained by low-visibility runway conditions and autoland safety confidence.
- Add `packet_id=DPL-ORBITAL-SERVICING-REFUEL-001`, `packet_id=DPL-DENIED-TERRAIN-DRONE-RESUPPLY-001`, `packet_id=DPL-COALITION-CABLE-LANDING-SOVEREIGNTY-001`, and `packet_id=DPL-RUNWAY-ICE-FOG-AUTOLAND-001` for branches that materially alter commander GO/NO-GO posture.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXIV Addendum)

- Add `tool_suite_id=ts-strategic-rare-gas-energetic-precursor-allocation-v1` + `protocol_stack_id=ps-strategic-rare-gas-energetic-precursor-allocation-stack-v1` when mobilization tempo depends on constrained rare-gas and energetic precursor supply.
- Add `tool_suite_id=ts-theater-autonomous-fortification-print-farm-v1` + `protocol_stack_id=ps-theater-autonomous-fortification-print-farm-stack-v1` when industrial output must pivot to distributed fortification demand.
- Add `packet_id=DPL-STRATEGIC-RAREGAS-ENERGETICS-001` and `packet_id=DPL-THEATER-FORTIFICATION-PRINTFARM-002` for strategic allocation and production-shift branches.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXV Addendum)

- Prioritize `tool_suite_id=ts-joint-cislunar-logistics-interdiction-reconstitution-v1` with `protocol_stack_id=ps-joint-cislunar-logistics-interdiction-reconstitution-stack-v1` when strategic space logistics, custody confidence, or cislunar maneuver assurance directly affect mission risk decisions.
- Add `tool_suite_id=ts-theater-underwater-datacenter-cooling-grid-defense-v1` with `protocol_stack_id=ps-theater-underwater-datacenter-cooling-grid-defense-stack-v1` when mission outcomes depend on underwater compute resilience, cooling continuity, or cyber-physical load restoration.
- Add `packet_id=DPL-CISLUNAR-LOGISTICS-INTERDICTION-001` and `packet_id=DPL-UNDERWATER-DATACENTER-COOLING-DEFENSE-001` for recommendations that alter mission posture, contingency branches, or strategic continuity authorities.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXIX Addendum)

- Add `tool_suite_id=ts-strategic-solid-rocket-motor-supply-surge-safety-assurance-v1` with `protocol_stack_id=ps-strategic-solid-rocket-motor-supply-surge-safety-assurance-stack-v1` when mobilization recommendations depend on rocket-motor lot integrity, hazardous transport windows, or deterrence-critical surge allocations.
- Add `tool_suite_id=ts-homeland-defense-industrial-copper-transformer-theft-grid-priority-v1` with `protocol_stack_id=ps-homeland-defense-industrial-copper-transformer-theft-grid-priority-stack-v1` when industrial readiness depends on theft-driven grid degradation, transformer replacement timelines, or defense-load priority.
- Add `packet_id=DPL-STRATEGIC-SOLID-ROCKET-MOTOR-SURGE-001` and `packet_id=DPL-HOMELAND-COPPER-TRANSFORMER-THEFT-001` for recommendations that materially change industrial surge posture, utility restoration priority, or strategic sustainment confidence.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIII Addendum)

- Add `tool_suite_id=ts-strategic-machine-tool-forging-capacity-priority-v1` + `protocol_stack_id=ps-strategic-machine-tool-forging-capacity-priority-stack-v1` when mobilization readiness depends on constrained heavy-manufacturing capacity, die life, or forge throughput.
- Add `tool_suite_id=ts-strategic-composite-prepreg-resin-defense-allocation-v1` + `protocol_stack_id=ps-strategic-composite-prepreg-resin-defense-allocation-stack-v1` when surge production is limited by prepreg shelf life, resin pedigree, or autoclave availability.
- Add `tool_suite_id=ts-strategic-bearing-gearbox-surge-assurance-v1` + `protocol_stack_id=ps-strategic-bearing-gearbox-surge-assurance-stack-v1` when aviation, maritime, or ground readiness depends on trusted rotating-component flow.
- Add `tool_suite_id=ts-homeland-defense-specialty-lubricant-hydraulic-fluid-allocation-v1` + `protocol_stack_id=ps-homeland-defense-specialty-lubricant-hydraulic-fluid-allocation-stack-v1` when shortages or contamination in specialty fluids constrain depots, bases, or industrial support nodes.
- Add `packet_id=DPL-MACHINE-TOOL-FORGING-001`, `packet_id=DPL-COMPOSITE-PREPREG-RESIN-001`, `packet_id=DPL-BEARING-GEARBOX-SURGE-001`, and `packet_id=DPL-LUBRICANT-HYDRAULIC-ALLOCATION-001` for recommendations that materially alter industrial surge posture, repair throughput, or commander confidence.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIV Addendum)

- Add `tool_suite_id=ts-strategic-photonics-laser-optics-allocation-v1` + `protocol_stack_id=ps-strategic-photonics-laser-optics-allocation-stack-v1` when mobilization readiness depends on laser optics, EO coatings, or specialty photonics lots for sensors, guidance, or directed-energy systems.
- Add `packet_id=DPL-PHOTONICS-LASER-OPTICS-ALLOCATION-001` for recommendations that materially alter industrial surge posture, electro-optical throughput, or release confidence.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLV Addendum)

- Add `tool_suite_id=ts-strategic-turbine-superalloy-tbc-priority-v1` + `protocol_stack_id=ps-strategic-turbine-superalloy-tbc-priority-stack-v1` when mobilization readiness depends on turbine hot-section materials, casting slots, or coating throughput across aviation and power fleets.
- Add `tool_suite_id=ts-space-ground-station-twt-cryogenic-surge-v1` + `protocol_stack_id=ps-space-ground-station-twt-cryogenic-surge-stack-v1` when industrial prioritization must preserve strategic ground-station hardware that supports SATCOM, SDA, or missile-warning continuity.
- Add `tool_suite_id=ts-joint-armored-vehicle-running-gear-priority-v1` + `protocol_stack_id=ps-joint-armored-vehicle-running-gear-priority-stack-v1` when mobilization output must shift toward track pads, roadwheels, or final drives to protect armored maneuver readiness.
- Add `packet_id=DPL-TURBINE-SUPERALLOY-TBC-001`, `packet_id=DPL-SPACE-GROUND-STATION-TWT-001`, and `packet_id=DPL-ARMORED-RUNNING-GEAR-001` for recommendations that materially alter industrial surge posture, strategic hardware allocation, or land-force readiness.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVII Addendum)

- Add `tool_suite_id=ts-strategic-carbon-carbon-nozzle-reentry-material-priority-v1` + `protocol_stack_id=ps-strategic-carbon-carbon-nozzle-reentry-material-priority-stack-v1` when mobilization readiness depends on carbon-carbon, ablatives, or nozzle-material throughput across strategic missile and reentry demand.
- Add `tool_suite_id=ts-strategic-guidance-seeker-imu-accelerometer-priority-v1` + `protocol_stack_id=ps-strategic-guidance-seeker-imu-accelerometer-priority-stack-v1` when surge output depends on trusted seekers, inertial components, and environmental-screening bottlenecks.
- Add `packet_id=DPL-CARBON-CARBON-NOZZLE-001` and `packet_id=DPL-GUIDANCE-SEEKER-IMU-001` for recommendations that materially alter industrial surge posture, strategic release confidence, or weapons-component allocation.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVIII Addendum)

- Add `tool_suite_id=ts-strategic-semiconductor-test-burn-in-mission-priority-v1` + `protocol_stack_id=ps-strategic-semiconductor-test-burn-in-mission-priority-stack-v1` when mobilization readiness depends on burn-in chamber capacity, environmental screening queues, or mission-priority semiconductor release.
- Add `tool_suite_id=ts-coalition-fuel-energy-water-nexus-anomaly-adjudication-v1` + `protocol_stack_id=ps-coalition-fuel-energy-water-nexus-anomaly-adjudication-stack-v1` when industrial throughput depends on whether plant utility anomalies are local outages, sabotage, or theater-wide FEW cascades.
- Add `tool_suite_id=ts-coalition-mission-data-releasability-waiver-adjudication-v1` + `protocol_stack_id=ps-coalition-mission-data-releasability-waiver-adjudication-stack-v1` when allied fabs, test houses, or shared production lines require controlled release of mission data, caveat-bound specs, or validation results.
- Add `packet_id=DPL-SEMICONDUCTOR-BURNIN-001`, `packet_id=DPL-FEW-NEXUS-ANOMALY-001`, and `packet_id=DPL-RELEASABILITY-WAIVER-001` for recommendations that materially alter industrial surge posture, utility survivability, or allied production trust.

## Domain Toolchain Override (2026-03-14, Expansion Wave LI Addendum)

- Add `tool_suite_id=ts-strategic-tritium-reservoir-surveillance-maintenance-priority-v1` + `protocol_stack_id=ps-strategic-tritium-reservoir-surveillance-maintenance-priority-stack-v1` when mobilization readiness depends on secure isotope handling throughput, reservoir surveillance cadence, or maintenance release timing across strategic systems.
- Add `tool_suite_id=ts-strategic-euv-photomask-rad-hard-semiconductor-priority-v1` + `protocol_stack_id=ps-strategic-euv-photomask-rad-hard-semiconductor-priority-stack-v1` when mobilization output is constrained by photomask access, specialty gas purity, or rad-hard lot release.
- Add `tool_suite_id=ts-joint-additive-warhead-liner-quality-assurance-cell-v1` + `protocol_stack_id=ps-joint-additive-warhead-liner-quality-assurance-cell-stack-v1` when mobilization readiness depends on additive warhead-liner quality, lot traceability, or release-governance confidence for munitions output.
- Add `tool_suite_id=ts-coalition-cross-border-battery-recycling-and-critical-mineral-recovery-cell-v1` + `protocol_stack_id=ps-coalition-cross-border-battery-recycling-and-critical-mineral-recovery-cell-stack-v1` when industrial recovery depends on mineral reclamation throughput, allied processing capacity, or cross-border quality assurance.
- Add `tool_suite_id=ts-strategic-quantum-network-key-custody-and-compromise-response-cell-v1` + `protocol_stack_id=ps-strategic-quantum-network-key-custody-and-compromise-response-cell-stack-v1` when defense-industrial command and release networks depend on trusted strategic cryptographic custody and compromise containment.
- Add `packet_id=DPL-TRITIUM-RESERVOIR-MAINTENANCE-001`, `packet_id=DPL-EUV-PHOTOMASK-RADHARD-001`, `packet_id=DPL-ADDITIVE-WARHEAD-LINER-QA-001`, `packet_id=DPL-BATTERY-RECYCLING-MINERAL-RECOVERY-001`, and `packet_id=DPL-QUANTUM-NETWORK-KEY-CUSTODY-001` for recommendations that materially alter strategic sustainment posture, industrial surge confidence, quality assurance, mineral recovery throughput, or deterrence-program readiness.

## Domain Toolchain Override (2026-03-14, Expansion Wave LII Addendum)

- Add `tool_suite_id=ts-strategic-solid-propellant-casting-cure-assurance-v1` + `protocol_stack_id=ps-strategic-solid-propellant-casting-cure-assurance-stack-v1` when industrial readiness depends on cure capacity, environmental control, or lot-release timing for solid propellant production and recertification.
- Add `packet_id=DPL-SOLID-PROPELLANT-CASTING-CURE-001` for recommendations that materially alter propellant throughput, lot confidence, or strategic motor readiness.
