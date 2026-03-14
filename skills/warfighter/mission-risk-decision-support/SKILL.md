---
name: mission-risk-decision-support
description: Quantify and communicate mission risk for commander decisions. Use when comparing options under uncertainty and documenting risk acceptance with controls.
---

# Mission Risk Decision Support

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: COAs, threat likelihood/severity, control measures, commander risk tolerance.
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

Primary products for this skill: risk decision matrix, recommended controls, risk acceptance statement draft.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: mission risk analytics boards, campaign dependency graph engines, cross-domain readiness dashboards.

## Protocol Profile

Preferred protocol families for this skill: USMTF, API/JSON, NATO APP-11/ADatP-3 aligned.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-deterrence-v1` with `protocol_stack_id=ps-joint-tactical-link-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-c2-fusion-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: command-approved risk ledger with authenticated voice confirmation and UTC acknowledgment logging.

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

- Default packet IDs: `DPL-TELECOM-PRIORITY-001`, `DPL-AUTON-MAP-POISON-001`, `DPL-FINRAIL-PAYROLL-001`.
- If no packet fully matches, define a provisional packet and assign a validation owner before release.

## Domain Toolchain Override (2026-03-08)

- Prioritize `tool_suite_id=ts-telecom-priority-routing-v1` + `protocol_stack_id=ps-telecom-priority-routing-stack-v1` when commander risk hinges on communications continuity.
- Elevate `tool_suite_id=ts-autonomy-map-poisoning-detect-v1` + `protocol_stack_id=ps-autonomy-map-poisoning-stack-v1` when navigation trust is uncertain.
- If financial rail disruption affects force readiness, add `tool_suite_id=ts-financial-rail-payroll-v1` + `protocol_stack_id=ps-financial-rail-payroll-stack-v1` as a required cross-check branch.

## Domain Toolchain Override (2026-03-08, Timing and Sustainment Integrity Addendum)

- Add `tool_suite_id=ts-anti-jam-gps-epoch-recovery-v1` + `protocol_stack_id=ps-anti-jam-gps-epoch-stack-v1` when risk posture depends on synchronized timing in denied PNT conditions.
- Add `tool_suite_id=ts-denied-fuel-bladder-integrity-v1` + `protocol_stack_id=ps-denied-fuel-bladder-integrity-stack-v1` when sustainment reliability is vulnerable to fuel contamination or sabotage.
- Add `packet_id=DPL-LONG-RANGE-FIRES-LOT-001` for any recommendation that changes long-range fires allocation based on ammunition reliability assumptions.

## Operational Execution Hardening

- Enforce `ack_chain_status=verified` for all mission-critical tool exchanges before recommending posture changes.
- Require `trust_score >= 0.80` on each primary external dependency; if lower, elevate alternate stack and mark outputs `provisional`.
- Add explicit degraded-mode triggers: stale data beyond `refresh_sla_minutes`, missing cryptographic validation, or failed human approval gate.
- Include a final command-ready line: `GO`, `NO-GO`, or `GO-WITH-CONSTRAINTS` with rationale tied to authority and protocol checks.

## Domain Toolchain Override (2026-03-08, Signature and Data Integrity Addendum)

- Add `tool_suite_id=ts-electronic-signature-survivability-v1` + `protocol_stack_id=ps-electronic-signature-survivability-stack-v1` when risk posture depends on adversary sensing pressure.
- Add `tool_suite_id=ts-multi-cloud-mission-data-integrity-v1` + `protocol_stack_id=ps-multi-cloud-mission-data-integrity-stack-v1` when branch viability depends on cross-cloud data trust.
- Add `packet_id=DPL-PRIORITY-OF-LIFE-ROUTING-001` when force protection and civil continuity tradeoffs affect commander risk acceptance.

## Domain Toolchain Override (2026-03-09, Solar Storm and Counterfeit Supply Addendum)

- Add `tool_suite_id=ts-space-weather-solar-storm-mission-assurance-v1` + `protocol_stack_id=ps-space-weather-solar-storm-mission-assurance-stack-v1` when mission risk depends on timing, SATCOM, or grid fragility during geomagnetic disturbance.
- Add `tool_suite_id=ts-homeland-microelectronics-counterfeit-quarantine-v1` + `protocol_stack_id=ps-homeland-microelectronics-counterfeit-quarantine-stack-v1` when recommendation confidence depends on trusted military microelectronics pedigree.
- Add `packet_id=DPL-SPACE-WEATHER-SOLAR-STORM-MISSION-ASSURANCE-001` and `packet_id=DPL-HOMELAND-MICROELECTRONICS-COUNTERFEIT-QUARANTINE-001` for risk branches that change commander acceptance thresholds.

## Domain Toolchain Override (2026-03-10, Strategic Continuity and Countertargeting Expansion)

- Add `tool_suite_id=ts-nc3-resilience-and-order-integrity-v1` + `protocol_stack_id=ps-nc3-resilience-and-order-integrity-stack-v1` when mission risk depends on authenticated strategic command continuity.
- Add `tool_suite_id=ts-denied-pnt-timing-holdover-v1` + `protocol_stack_id=ps-denied-pnt-timing-holdover-stack-v1` when risk posture depends on synchronized timing under GNSS denial.
- Add `tool_suite_id=ts-precision-effects-weaponeering-ai-assurance-v1` + `protocol_stack_id=ps-precision-effects-weaponeering-ai-assurance-stack-v1` when risk recommendations rely on AI-assisted targeting effects.
- Add `tool_suite_id=ts-hyperscale-cloud-failover-command-continuity-v1` + `protocol_stack_id=ps-hyperscale-cloud-failover-command-continuity-stack-v1` when command continuity relies on contested cloud infrastructure.
- Add `packet_id=DPL-NC3-RESILIENCE-ORDER-INTEGRITY-001`, `packet_id=DPL-DENIED-PNT-TIMING-HOLDOVER-001`, and `packet_id=DPL-PRECISION-EFFECTS-WEAPONEERING-AI-ASSURANCE-001` for branches that can alter commander risk acceptance.

## Domain Toolchain Override (2026-03-10, Deepfake Orders, PNT Cross-Check, and AI Poisoning Addendum)

- Add `tool_suite_id=ts-deepfake-orders-auth-countersign-v1` + `protocol_stack_id=ps-deepfake-orders-auth-countersign-stack-v1` when commander risk depends on trusted command-path authentication under synthetic media pressure.
- Add `tool_suite_id=ts-quantum-navigation-pnt-cross-check-v1` + `protocol_stack_id=ps-quantum-navigation-pnt-cross-check-stack-v1` when mission risk thresholds depend on navigation and timing confidence under spoofing or jamming.
- Add `tool_suite_id=ts-adversarial-ai-model-poisoning-detection-v1` + `protocol_stack_id=ps-adversarial-ai-model-poisoning-detection-stack-v1` when risk decisions rely on mission AI outputs with uncertain provenance.
- Add `packet_id=DPL-DEEPFAKE-ORDERS-AUTH-COUNTERSIGN-001`, `packet_id=DPL-QUANTUM-NAV-PNT-CROSS-CHECK-001`, and `packet_id=DPL-ADVERSARIAL-AI-MODEL-POISONING-DETECTION-001` for branches that can materially alter commander risk acceptance.

## Domain Toolchain Override (2026-03-12, Expansion Wave XV Addendum)

- Add tool_suite_id=ts-strategic-homeland-port-fuel-terminal-cyber-physical-blackstart-cell-v1 + protocol_stack_id=ps-strategic-homeland-port-fuel-terminal-cyber-physical-blackstart-cell-stack-v1 when risk acceptance depends on fuel infrastructure restoration and cyber-safe blackstart sequencing.
- Add tool_suite_id=ts-strategic-deepfake-diplomatic-hotline-authentication-cell-v1 + protocol_stack_id=ps-strategic-deepfake-diplomatic-hotline-authentication-cell-stack-v1 when strategic decision confidence depends on authenticated crisis communication pathways.
- Add packet_id=DPL-HOMELAND-PORT-FUEL-BLACKSTART-001 and packet_id=DPL-DEEPFAKE-HOTLINE-AUTH-001 for branches that materially alter commander risk posture, escalation pathways, or continuity assumptions.


## Domain Toolchain Override (2026-03-12, Expansion Wave XVI Addendum)

- Add tool_suite_id=ts-strategic-grid-transformer-supply-sabotage-and-restoration-cell-v1 + protocol_stack_id=ps-strategic-grid-transformer-supply-sabotage-and-restoration-cell-stack-v1 when mission risk depends on power-grid transformer survivability, restoration timing, and sabotage confidence.
- Add tool_suite_id=ts-homeland-defense-satellite-timing-financial-clearing-fallback-cell-v1 + protocol_stack_id=ps-homeland-defense-satellite-timing-financial-clearing-fallback-cell-stack-v1 when commander risk acceptance depends on timing trust and financial-clearing continuity.
- Add packet_id=DPL-GRID-TRANSFORMER-RESTORE-001 and packet_id=DPL-SAT-TIMING-FINANCIAL-CLEARING-001 for branches that alter sustainment confidence, escalation posture, or force-readiness assumptions.

## Domain Toolchain Override (2026-03-12, Expansion Wave XIX Addendum)

- Add `tool_suite_id=ts-iamd-depletion-forecast-v1` + `protocol_stack_id=ps-iamd-depletion-forecast-stack-v1` when mission risk depends on interceptor endurance and defended-asset reprioritization under sustained salvos.
- Add `tool_suite_id=ts-contested-personnel-recovery-v1` + `protocol_stack_id=ps-contested-personnel-recovery-stack-v1` when commander risk posture depends on isolated personnel survival, authentication confidence, or contested recovery feasibility.
- Add `tool_suite_id=ts-jadc2-datalink-bridging-priority-v1` + `protocol_stack_id=ps-jadc2-datalink-bridging-priority-stack-v1` when risk acceptance depends on cross-link translation fidelity and message-priority acknowledgment integrity.
- Add `packet_id=DPL-IAMD-DEPLETION-001`, `packet_id=DPL-CONTESTED-PR-001`, and `packet_id=DPL-JADC2-BRIDGE-001` when these dependencies materially change commander GO/NO-GO decisions.

## Domain Toolchain Override (2026-03-12, Expansion Wave XX Addendum)

- Add `tool_suite_id=ts-nuclear-command-auth-containment-v1` + `protocol_stack_id=ps-nuclear-command-auth-containment-stack-v1` when mission risk depends on trusted strategic order-path authentication or high-consequence incident containment.
- Add `tool_suite_id=ts-strategic-mobility-chokepoint-optimizer-v1` + `protocol_stack_id=ps-strategic-mobility-chokepoint-optimizer-stack-v1` when commander risk acceptance depends on rail-air-sealift throughput resilience.
- Add `tool_suite_id=ts-auton-target-human-override-assurance-v1` + `protocol_stack_id=ps-auton-target-human-override-assurance-stack-v1` when recommendations depend on autonomous targeting confidence and deterministic human override controls.
- Add `packet_id=DPL-NUCLEAR-AUTH-CONTAINMENT-001`, `packet_id=DPL-STRAT-MOBILITY-CHOKEPOINT-001`, and `packet_id=DPL-AUTON-TARGET-HUMAN-OVERRIDE-001` for branches that materially change GO/NO-GO posture.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXIII Addendum)

- Add `tool_suite_id=ts-orbital-servicing-refuel-assurance-v1` + `protocol_stack_id=ps-orbital-servicing-refuel-assurance-stack-v1` when recommendations depend on contested space-logistics servicing continuity, custody confidence, or maneuver-safe refuel timing.
- Add `tool_suite_id=ts-denied-terrain-drone-resupply-nav-v1` + `protocol_stack_id=ps-denied-terrain-drone-resupply-nav-stack-v1` when branch viability depends on autonomous resupply route confidence through denied terrain.
- Add `tool_suite_id=ts-coalition-cable-landing-data-sovereignty-v1` + `protocol_stack_id=ps-coalition-cable-landing-data-sovereignty-stack-v1` when recommendations depend on sovereign data routing, coalition caveats, or cable-landing continuity.
- Add `tool_suite_id=ts-runway-ice-fog-autoland-assurance-v1` + `protocol_stack_id=ps-runway-ice-fog-autoland-assurance-stack-v1` when mission tempo is constrained by low-visibility runway conditions and autoland safety confidence.
- Add `packet_id=DPL-ORBITAL-SERVICING-REFUEL-001`, `packet_id=DPL-DENIED-TERRAIN-DRONE-RESUPPLY-001`, `packet_id=DPL-COALITION-CABLE-LANDING-SOVEREIGNTY-001`, and `packet_id=DPL-RUNWAY-ICE-FOG-AUTOLAND-001` for branches that materially alter commander GO/NO-GO posture.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXIV Addendum)

- Add `tool_suite_id=ts-theater-llm-opsec-prompt-injection-defense-v1` + `protocol_stack_id=ps-theater-llm-opsec-prompt-injection-defense-stack-v1` when commander risk acceptance depends on trusted mission-AI outputs and prompt-injection containment.
- Add `tool_suite_id=ts-strategic-rare-gas-energetic-precursor-allocation-v1` + `protocol_stack_id=ps-strategic-rare-gas-energetic-precursor-allocation-stack-v1` when recommendation confidence depends on precursor sustainment availability.
- Add `packet_id=DPL-THEATER-LLM-OPSEC-INJECTION-001` and `packet_id=DPL-STRATEGIC-RAREGAS-ENERGETICS-001` for branches that materially alter GO/NO-GO posture.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXV Addendum)

- Prioritize `tool_suite_id=ts-joint-cislunar-logistics-interdiction-reconstitution-v1` with `protocol_stack_id=ps-joint-cislunar-logistics-interdiction-reconstitution-stack-v1` when strategic space logistics, custody confidence, or cislunar maneuver assurance directly affect mission risk decisions.
- Add `tool_suite_id=ts-theater-underwater-datacenter-cooling-grid-defense-v1` with `protocol_stack_id=ps-theater-underwater-datacenter-cooling-grid-defense-stack-v1` when mission outcomes depend on underwater compute resilience, cooling continuity, or cyber-physical load restoration.
- Add `packet_id=DPL-CISLUNAR-LOGISTICS-INTERDICTION-001` and `packet_id=DPL-UNDERWATER-DATACENTER-COOLING-DEFENSE-001` for recommendations that alter mission posture, contingency branches, or strategic continuity authorities.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXX Addendum)

- Add `tool_suite_id=ts-theater-underground-fiber-cut-comms-reroute-v1` + `protocol_stack_id=ps-theater-underground-fiber-cut-comms-reroute-stack-v1` when commander risk depends on restoring command continuity after terrestrial backhaul loss.
- Add `tool_suite_id=ts-joint-microgrid-islanded-base-load-shedding-v1` + `protocol_stack_id=ps-joint-microgrid-islanded-base-load-shedding-stack-v1` when recommendation viability depends on islanded base power continuity and controlled load shedding.
- Add `tool_suite_id=ts-coalition-autonomous-maritime-mcm-deconfliction-v1` + `protocol_stack_id=ps-coalition-autonomous-maritime-mcm-deconfliction-stack-v1` when mission branches depend on coalition autonomous MCM lane release confidence.
- Add `tool_suite_id=ts-joint-rail-bridge-sabotage-restoration-force-flow-v1` + `protocol_stack_id=ps-joint-rail-bridge-sabotage-restoration-force-flow-stack-v1` when risk posture hinges on rapid restoration of rail-bridge mobility chokepoints.
- Add `tool_suite_id=ts-coalition-denied-space-maneuver-custody-arbitration-v1` + `protocol_stack_id=ps-coalition-denied-space-maneuver-custody-arbitration-stack-v1` when recommendations require coalition custody arbitration for denied-space maneuver release.
- Add `packet_id=DPL-THEATER-UNDERGROUND-FIBER-REROUTE-001`, `packet_id=DPL-JOINT-MICROGRID-ISLANDED-LOAD-001`, `packet_id=DPL-COALITION-AUTONOMOUS-MCM-DECONFLICTION-001`, `packet_id=DPL-JOINT-RAIL-BRIDGE-SABOTAGE-RESTORATION-001`, and `packet_id=DPL-COALITION-DENIED-SPACE-CUSTODY-001` for branches that materially alter commander GO/NO-GO decisions.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXI Addendum)

- Add `tool_suite_id=ts-joint-civil-internet-blackout-military-mesh-bridging-v1` + `protocol_stack_id=ps-joint-civil-internet-blackout-military-mesh-bridging-stack-v1` when commander risk depends on preserving civil-military command continuity during internet outages.
- Add `tool_suite_id=ts-joint-low-earth-orbit-satcom-traffic-priority-denial-recovery-v1` + `protocol_stack_id=ps-joint-low-earth-orbit-satcom-traffic-priority-denial-recovery-stack-v1` when risk posture hinges on denied SATCOM capacity and priority traffic restoration.
- Add `tool_suite_id=ts-contested-data-center-water-cooling-failure-load-shedding-v1` + `protocol_stack_id=ps-contested-data-center-water-cooling-failure-load-shedding-stack-v1` when mission risk acceptance depends on thermal-stressed compute continuity.
- Add `tool_suite_id=ts-strategic-pharmaceutical-supply-chain-contamination-countermeasure-v1` + `protocol_stack_id=ps-strategic-pharmaceutical-supply-chain-contamination-countermeasure-stack-v1` when force-health sustainment confidence is affected by pharmaceutical contamination risk.
- Add `packet_id=DPL-JOINT-CIVIL-INTERNET-BLACKOUT-MESH-BRIDGING-001`, `packet_id=DPL-JOINT-LEO-SATCOM-PRIORITY-DENIAL-RECOVERY-001`, `packet_id=DPL-CONTESTED-DATACENTER-COOLING-LOADSHED-001`, and `packet_id=DPL-STRATEGIC-PHARMA-SUPPLY-CONTAMINATION-COUNTERMEASURE-001` for branches that materially alter commander GO/NO-GO thresholds.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXII Addendum)

- Add `tool_suite_id=ts-theater-hardened-fiber-satcom-hybrid-command-backbone-v1` + `protocol_stack_id=ps-theater-hardened-fiber-satcom-hybrid-command-backbone-stack-v1` when mission risk posture depends on resilient command-backbone continuity across contested fiber and SATCOM paths.
- Add `tool_suite_id=ts-strategic-microelectronics-fab-water-power-continuity-v1` + `protocol_stack_id=ps-strategic-microelectronics-fab-water-power-continuity-stack-v1` when force-readiness risk depends on strategic microelectronics output continuity.
- Add `tool_suite_id=ts-tactical-loitering-munition-swarm-priority-defense-v1` + `protocol_stack_id=ps-tactical-loitering-munition-swarm-priority-defense-stack-v1` when commander risk acceptance hinges on swarm defense prioritization and interceptor sufficiency.
- Add `tool_suite_id=ts-strategic-food-port-hoarding-distribution-stability-v1` + `protocol_stack_id=ps-strategic-food-port-hoarding-distribution-stability-stack-v1` when strategic sustainment risk is driven by port-hoarding shocks and food distribution instability.
- Add `packet_id=DPL-THEATER-HARDENED-FIBER-SATCOM-HYBRID-COMMAND-BACKBONE-001`, `packet_id=DPL-STRATEGIC-MICROELECTRONICS-FAB-WATER-POWER-CONTINUITY-001`, `packet_id=DPL-TACTICAL-LOITERING-MUNITION-SWARM-PRIORITY-DEFENSE-001`, and `packet_id=DPL-STRATEGIC-FOOD-PORT-HOARDING-DISTRIBUTION-STABILITY-001` for branches that materially alter commander GO/NO-GO posture.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXIII Addendum)

- Add `tool_suite_id=ts-strategic-ai-enabled-nuclear-incident-warning-integrity-v1` + `protocol_stack_id=ps-strategic-ai-enabled-nuclear-incident-warning-integrity-stack-v1` when commander risk posture depends on trusted strategic warning authenticity under AI-enabled spoof pressure.
- Add `tool_suite_id=ts-joint-hypersonic-defense-sensor-fusion-civil-continuity-v1` + `protocol_stack_id=ps-joint-hypersonic-defense-sensor-fusion-civil-continuity-stack-v1` when mission risk depends on integrating military intercept timing with civil continuity decisions.
- Add `tool_suite_id=ts-homeland-grid-blackstart-fuel-water-rail-coordination-v1` + `protocol_stack_id=ps-homeland-grid-blackstart-fuel-water-rail-coordination-stack-v1` when branch viability depends on synchronized infrastructure restoration and DSCA sustainment.
- Add `tool_suite_id=ts-joint-undersea-cable-repeater-salvage-rapid-restoration-v1` + `protocol_stack_id=ps-joint-undersea-cable-repeater-salvage-rapid-restoration-stack-v1` when risk decisions depend on rapid command-backbone recovery after undersea repeater loss.
- Add `packet_id=DPL-STRATEGIC-AI-NUCLEAR-INCIDENT-WARNING-INTEGRITY-001`, `packet_id=DPL-JOINT-HYPERSONIC-DEFENSE-SENSOR-FUSION-CIVIL-CONTINUITY-001`, `packet_id=DPL-HOMELAND-GRID-BLACKSTART-FUEL-WATER-RAIL-COORDINATION-001`, and `packet_id=DPL-JOINT-UNDERSEA-CABLE-REPEATER-SALVAGE-RESTORATION-001` for branches that materially alter commander risk acceptance and continuity posture.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXIV Addendum)

- Add `tool_suite_id=ts-space-domain-cislunar-sustainment-legal-governance-cargo-priority-v1` + `protocol_stack_id=ps-space-domain-cislunar-sustainment-legal-governance-cargo-priority-stack-v1` when mission risk decisions depend on cislunar sustainment legality, cargo-priority arbitration, or maneuver custody confidence.
- Add `tool_suite_id=ts-joint-civil-nuclear-plant-grid-islanding-population-protection-v1` + `protocol_stack_id=ps-joint-civil-nuclear-plant-grid-islanding-population-protection-stack-v1` when commander risk acceptance depends on nuclear grid-islanding safety, emergency cooling continuity, or public protection timing.
- Add `tool_suite_id=ts-strategic-seabed-critical-mineral-supply-denial-mitigation-v1` + `protocol_stack_id=ps-strategic-seabed-critical-mineral-supply-denial-mitigation-stack-v1` when recommendations depend on strategic critical-mineral continuity under seabed disruption pressure.
- Add `tool_suite_id=ts-theater-forward-microreactor-fuel-security-blackstart-v1` + `protocol_stack_id=ps-theater-forward-microreactor-fuel-security-blackstart-stack-v1` when mission risk depends on forward microreactor fuel custody and blackstart restoration confidence.
- Add `packet_id=DPL-SPACE-DOMAIN-CISLUNAR-SUSTAINMENT-LEGAL-GOVERNANCE-CARGO-PRIORITY-001`, `packet_id=DPL-JOINT-CIVIL-NUCLEAR-PLANT-GRID-ISLANDING-POPULATION-PROTECTION-001`, `packet_id=DPL-STRATEGIC-SEABED-CRITICAL-MINERAL-SUPPLY-DENIAL-MITIGATION-001`, and `packet_id=DPL-THEATER-FORWARD-MICROREACTOR-FUEL-SECURITY-BLACKSTART-001` for branches that materially alter commander GO/NO-GO posture.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXV Addendum)

- Add `tool_suite_id=ts-joint-strategic-hypersonic-launch-attribution-escalation-control-v1` + `protocol_stack_id=ps-joint-strategic-hypersonic-launch-attribution-escalation-control-stack-v1` when mission-risk posture depends on trusted launch attribution and escalation-safe branch timing.
- Add `tool_suite_id=ts-joint-space-constellation-safe-mode-recovery-priority-v1` + `protocol_stack_id=ps-joint-space-constellation-safe-mode-recovery-priority-stack-v1` when recommendations depend on restoring constellation services from safe-mode cascade conditions.
- Add `tool_suite_id=ts-strategic-quantum-network-ops-center-cyber-resilience-v1` + `protocol_stack_id=ps-strategic-quantum-network-ops-center-cyber-resilience-stack-v1` when commander risk acceptance depends on strategic key-custody trust and cyber recovery confidence.
- Add `tool_suite_id=ts-joint-maritime-drone-carrier-air-defense-magazine-arbitration-v1` + `protocol_stack_id=ps-joint-maritime-drone-carrier-air-defense-magazine-arbitration-stack-v1` when mission branches depend on interceptor sufficiency and defended-asset prioritization.
- Add `packet_id=DPL-JOINT-STRATEGIC-HYPERSONIC-LAUNCH-ATTRIBUTION-ESCALATION-CONTROL-001`, `packet_id=DPL-JOINT-SPACE-CONSTELLATION-SAFE-MODE-RECOVERY-MISSION-PRIORITY-001`, `packet_id=DPL-STRATEGIC-QUANTUM-NETWORK-OPERATIONS-CYBER-RESILIENCE-001`, and `packet_id=DPL-JOINT-MARITIME-DRONE-CARRIER-AIR-DEFENSE-MAGAZINE-ARBITRATION-001` for branches that materially alter commander GO/NO-GO posture.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXVI Addendum)

- Add `tool_suite_id=ts-joint-strategic-portable-reactor-radiological-containment-force-continuity-v1` + `protocol_stack_id=ps-joint-strategic-portable-reactor-radiological-containment-force-continuity-stack-v1` when mission-risk posture depends on radiological incident containment with force continuity.
- Add `tool_suite_id=ts-theater-ai-air-defense-iff-spoofing-recovery-v1` + `protocol_stack_id=ps-theater-ai-air-defense-iff-spoofing-recovery-stack-v1` when commander risk acceptance depends on restoring trusted IFF confidence under spoofing pressure.
- Add `tool_suite_id=ts-homeland-energy-market-cyber-disruption-defense-industrial-load-priority-v1` + `protocol_stack_id=ps-homeland-energy-market-cyber-disruption-defense-industrial-load-priority-stack-v1` when recommendations depend on defense-industrial energy-load continuity under cyber disruption.
- Add `tool_suite_id=ts-joint-cyber-physical-dam-spillway-sabotage-downstream-evacuation-sync-v1` + `protocol_stack_id=ps-joint-cyber-physical-dam-spillway-sabotage-downstream-evacuation-sync-stack-v1` when mission branches depend on synchronized spillway response and downstream evacuation timing.
- Add `packet_id=DPL-JOINT-STRATEGIC-PORTABLE-REACTOR-RADIOLOGICAL-CONTAINMENT-FORCE-CONTINUITY-001`, `packet_id=DPL-THEATER-AI-AIR-DEFENSE-IFF-SPOOFING-RECOVERY-001`, `packet_id=DPL-HOMELAND-ENERGY-MARKET-CYBER-DISRUPTION-DEFENSE-INDUSTRIAL-LOAD-PRIORITY-001`, and `packet_id=DPL-JOINT-CYBER-PHYSICAL-DAM-SPILLWAY-SABOTAGE-DOWNSTREAM-EVACUATION-SYNC-001` for branches that materially alter commander GO/NO-GO posture.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXVII Addendum)

- Add `tool_suite_id=ts-theater-quantum-resistant-datalink-key-rollover-emission-discipline-v1` + `protocol_stack_id=ps-theater-quantum-resistant-datalink-key-rollover-emission-discipline-stack-v1` when commander risk posture depends on trusted datalink continuity under contested-spectrum pressure.
- Add `tool_suite_id=ts-homeland-space-weather-grid-financial-clearing-military-support-v1` + `protocol_stack_id=ps-homeland-space-weather-grid-financial-clearing-military-support-stack-v1` when risk acceptance depends on geomagnetic disruption effects across grid and clearing infrastructure.
- Add `tool_suite_id=ts-tactical-denied-pnt-precision-fires-human-override-safety-v1` + `protocol_stack_id=ps-tactical-denied-pnt-precision-fires-human-override-safety-stack-v1` when recommendations depend on denied-PNT confidence and deterministic human-override safeguards.
- Add `tool_suite_id=ts-strategic-defense-industrial-additive-feedstock-counterfeit-eradication-v1` + `protocol_stack_id=ps-strategic-defense-industrial-additive-feedstock-counterfeit-eradication-stack-v1` when mission risk depends on trusted additive feedstock and defense-industrial output integrity.
- Add `packet_id=DPL-THEATER-QUANTUM-RESISTANT-DATALINK-KEY-ROLLOVER-EMISSION-DISCIPLINE-001`, `packet_id=DPL-HOMELAND-SPACE-WEATHER-GRID-FINANCIAL-CLEARING-MILITARY-SUPPORT-001`, `packet_id=DPL-TACTICAL-DENIED-PNT-PRECISION-FIRES-HUMAN-OVERRIDE-SAFETY-001`, and `packet_id=DPL-STRATEGIC-DEFENSE-INDUSTRIAL-ADDITIVE-FEEDSTOCK-COUNTERFEIT-ERADICATION-001` for branches that materially alter commander GO/NO-GO posture.

## Domain Toolchain Override (2026-03-13, Expansion Wave XL Addendum)

- Add `tool_suite_id=ts-joint-weather-radar-spectrum-deconfliction-v1` + `protocol_stack_id=ps-joint-weather-radar-spectrum-deconfliction-stack-v1` when commander risk posture depends on trusted mission-weather products surviving spectrum contention and emission-control constraints.
- Add `tool_suite_id=ts-homeland-civil-nuclear-plant-grid-loss-military-support-v1` + `protocol_stack_id=ps-homeland-civil-nuclear-plant-grid-loss-military-support-stack-v1` when DSCA support, cooling continuity, and public-protection timing materially affect risk acceptance.
- Add `tool_suite_id=ts-joint-disconnected-mission-ai-model-update-attestation-v1` + `protocol_stack_id=ps-joint-disconnected-mission-ai-model-update-attestation-stack-v1` when mission branches rely on disconnected AI updates, signed provenance, or rollback safety.
- Add `tool_suite_id=ts-strategic-contested-lng-bunker-fleet-fuel-allocation-v1` + `protocol_stack_id=ps-strategic-contested-lng-bunker-fleet-fuel-allocation-stack-v1` when maritime fuel access, berth confidence, or fleet sustainment timing alters commander risk thresholds.
- Add `packet_id=DPL-JOINT-WEATHER-RADAR-SPECTRUM-DECONFLICTION-001`, `packet_id=DPL-HOMELAND-CIVIL-NUCLEAR-GRID-LOSS-MILSUP-001`, `packet_id=DPL-JOINT-DISCONNECTED-AI-MODEL-UPDATE-ATTESTATION-001`, and `packet_id=DPL-STRATEGIC-LNG-BUNKER-FLEET-FUEL-ALLOCATION-001` for branches that materially alter commander GO/NO-GO posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLI Addendum)

- Add `tool_suite_id=ts-joint-cislunar-timing-trust-collision-mitigation-v1` + `protocol_stack_id=ps-joint-cislunar-timing-trust-collision-mitigation-stack-v1` when commander risk posture depends on degraded cislunar timing trust, custody confidence, or conjunction release windows.
- Add `tool_suite_id=ts-strategic-domestic-transport-chokepoint-reroute-v1` + `protocol_stack_id=ps-strategic-domestic-transport-chokepoint-reroute-stack-v1` when domestic chokepoint failures materially alter deployment timelines, force-flow resiliency, or sustainment confidence.
- Add `tool_suite_id=ts-expeditionary-autonomous-sustainment-routing-drift-governance-v1` + `protocol_stack_id=ps-expeditionary-autonomous-sustainment-routing-drift-governance-stack-v1` when sustainment viability depends on autonomy-model trust, drift containment, or route replanning speed.
- Add `tool_suite_id=ts-theater-digital-terrain-fabric-spoof-route-approval-v1` + `protocol_stack_id=ps-theater-digital-terrain-fabric-spoof-route-approval-stack-v1` when maneuver options depend on trusted terrain provenance and rapid route re-approval.
- Add `tool_suite_id=ts-joint-contested-cellular-timing-holdover-first-responder-priority-v1` + `protocol_stack_id=ps-joint-contested-cellular-timing-holdover-first-responder-priority-stack-v1` when homeland-support branches depend on telecom timing holdover, public-safety traffic priority, or civil-military comms continuity.
- Add `packet_id=DPL-JOINT-CISLUNAR-TIMING-COLLISION-MITIGATION-001`, `packet_id=DPL-STRATEGIC-DOMESTIC-TRANSPORT-CHOKEPOINT-REROUTE-001`, `packet_id=DPL-EXPEDITIONARY-AUTONOMOUS-SUSTAINMENT-ROUTING-DRIFT-001`, `packet_id=DPL-THEATER-DIGITAL-TERRAIN-SPOOF-ROUTE-APPROVAL-001`, and `packet_id=DPL-JOINT-CELLULAR-TIMING-HOLDOVER-FIRST-RESPONDER-001` for branches that materially alter commander GO/NO-GO posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLII Addendum)

- Add `tool_suite_id=ts-theater-mission-ai-confidence-early-warning-v1` + `protocol_stack_id=ps-theater-mission-ai-confidence-early-warning-stack-v1` when commander risk acceptance depends on trust in mission-AI outputs, drift warnings, or rollback timing.
- Add `tool_suite_id=ts-strategic-economic-coercion-logistics-warning-v1` + `protocol_stack_id=ps-strategic-economic-coercion-logistics-warning-stack-v1` when risk posture depends on fragile routes, carrier pressure, or adversary coercion against sustainment.
- Add `tool_suite_id=ts-theater-no-strike-geofence-integrity-v1` + `protocol_stack_id=ps-theater-no-strike-geofence-integrity-stack-v1` when protected-boundary drift could invalidate fires, maneuver, or civilian-risk assumptions.
- Add `packet_id=DPL-MISSION-AI-CONFIDENCE-001`, `packet_id=DPL-ECON-COERCION-LOGISTICS-001`, and `packet_id=DPL-NO-STRIKE-GEOFENCE-001` for branches that materially change commander GO, NO-GO, or GO-WITH-CONSTRAINTS decisions.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIII Addendum)

- Add `tool_suite_id=ts-joint-munition-dataload-crypto-fill-reconstitution-v1` + `protocol_stack_id=ps-joint-munition-dataload-crypto-fill-reconstitution-stack-v1` when commander risk posture depends on trusted weapon or EW mission-data reconstitution after compromise or relocation.
- Add `tool_suite_id=ts-coalition-neo-identity-fraud-suppression-v1` + `protocol_stack_id=ps-coalition-neo-identity-fraud-suppression-stack-v1` when evacuation legitimacy, family reunification, or coalition screening confidence materially affects risk acceptance.
- Add `tool_suite_id=ts-strategic-harbor-tug-pilotage-sealift-priority-v1` + `protocol_stack_id=ps-strategic-harbor-tug-pilotage-sealift-priority-stack-v1` when sealift timing, berth windows, or harbor-control scarcity becomes a decisive mission-risk driver.
- Add `packet_id=DPL-MUNITION-DATALOAD-CRYPTO-001`, `packet_id=DPL-NEO-IDENTITY-FRAUD-001`, and `packet_id=DPL-HARBOR-TUG-PILOTAGE-SEALIFT-001` for branches that materially change commander GO, NO-GO, or GO-WITH-CONSTRAINTS posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIV Addendum)

- Add `tool_suite_id=ts-joint-airbase-arresting-gear-runway-cable-reconstitution-v1` + `protocol_stack_id=ps-joint-airbase-arresting-gear-runway-cable-reconstitution-stack-v1` when commander risk depends on sortie regeneration, arresting-gear integrity, or runway-end cable recovery at damaged airbases.
- Add `tool_suite_id=ts-joint-commercial-sat-imagery-retask-governance-v1` + `protocol_stack_id=ps-joint-commercial-sat-imagery-retask-governance-stack-v1` when risk decisions depend on trusted fallback ISR coverage after commercial imagery denial or political restrictions.
- Add `tool_suite_id=ts-joint-tactical-edge-dataset-provenance-rollback-v1` + `protocol_stack_id=ps-joint-tactical-edge-dataset-provenance-rollback-stack-v1` when commander risk acceptance depends on restoring trusted edge datasets or rolling back suspect model updates.
- Add `packet_id=DPL-ARRESTING-GEAR-RUNWAY-CABLE-001`, `packet_id=DPL-COMMERCIAL-SAT-IMAGERY-RETASK-001`, and `packet_id=DPL-TACTICAL-EDGE-DATASET-ROLLBACK-001` for branches that materially change commander GO, NO-GO, or GO-WITH-CONSTRAINTS posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLV Addendum)

- Add `tool_suite_id=ts-joint-civil-reserve-air-fleet-activation-v1` + `protocol_stack_id=ps-joint-civil-reserve-air-fleet-activation-stack-v1` when commander risk acceptance depends on reserve or commercial airlift closing deployment, evacuation, or sustainment gaps.
- Add `tool_suite_id=ts-theater-mission-sbom-emergency-patch-v1` + `protocol_stack_id=ps-theater-mission-sbom-emergency-patch-stack-v1` when risk posture depends on urgent software remediation, rollback assurance, or artifact trust across mission systems.
- Add `tool_suite_id=ts-joint-digital-order-watermark-recall-v1` + `protocol_stack_id=ps-joint-digital-order-watermark-recall-stack-v1` when commander confidence depends on authentic order distribution and rapid containment of spoofed or stale digital tasking.
- Add `packet_id=DPL-CIVIL-RESERVE-AIR-FLEET-001`, `packet_id=DPL-MISSION-SBOM-EMERGENCY-PATCH-001`, and `packet_id=DPL-DIGITAL-ORDER-WATERMARK-001` for branches that materially change commander GO, NO-GO, or GO-WITH-CONSTRAINTS posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVI Addendum)

- Add `tool_suite_id=ts-theater-battlefield-cloud-federation-admission-control-v1` + `protocol_stack_id=ps-theater-battlefield-cloud-federation-admission-control-stack-v1` when commander risk depends on whether mission software, data, or edge services can be admitted safely across contested cloud enclaves.
- Add `tool_suite_id=ts-joint-ai-order-intent-integrity-v1` + `protocol_stack_id=ps-joint-ai-order-intent-integrity-stack-v1` when risk acceptance depends on trusted machine-generated tasking and semantic fidelity to commander intent.
- Add `tool_suite_id=ts-strategic-fuel-additive-adulteration-interdiction-v1` + `protocol_stack_id=ps-strategic-fuel-additive-adulteration-interdiction-stack-v1` when sustainment feasibility hinges on trusted fuel-additive pedigree or rapid contamination quarantine.
- Add `packet_id=DPL-BATTLEFIELD-CLOUD-ADMISSION-001`, `packet_id=DPL-AI-ORDER-INTENT-001`, and `packet_id=DPL-FUEL-ADDITIVE-ADULTERATION-001` for branches that materially change commander GO, NO-GO, or GO-WITH-CONSTRAINTS posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVII Addendum)

- Add `tool_suite_id=ts-theater-cloud-credential-burn-access-reconstitution-v1` + `protocol_stack_id=ps-theater-cloud-credential-burn-access-reconstitution-stack-v1` when commander risk depends on containing identity compromise without losing mission-essential access.
- Add `tool_suite_id=ts-homeland-base-fuel-hydrant-fire-suppression-recovery-v1` + `protocol_stack_id=ps-homeland-base-fuel-hydrant-fire-suppression-recovery-stack-v1` when sortie generation or base survivability depends on safe fuel and fire-control restoration.
- Add `tool_suite_id=ts-strategic-guidance-seeker-imu-accelerometer-priority-v1` + `protocol_stack_id=ps-strategic-guidance-seeker-imu-accelerometer-priority-stack-v1` when risk acceptance depends on trusted precision-guidance component pedigree or constrained lot release.
- Add `packet_id=DPL-CLOUD-CREDENTIAL-BURN-001`, `packet_id=DPL-BASE-FUEL-HYDRANT-FIRE-SUPPRESSION-001`, and `packet_id=DPL-GUIDANCE-SEEKER-IMU-001` for branches that materially change commander GO, NO-GO, or GO-WITH-CONSTRAINTS posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVIII Addendum)

- Add `tool_suite_id=ts-joint-adversary-kill-web-disruption-assessment-v1` + `protocol_stack_id=ps-joint-adversary-kill-web-disruption-assessment-stack-v1` when commander risk acceptance depends on breaking adversary sensor-to-shooter seams without outrunning attribution or escalation controls.
- Add `tool_suite_id=ts-coalition-fuel-energy-water-nexus-anomaly-adjudication-v1` + `protocol_stack_id=ps-coalition-fuel-energy-water-nexus-anomaly-adjudication-stack-v1` when risk posture depends on whether utility anomalies across bases, ports, or hospitals are sabotage, cascade, or shortfall.
- Add `tool_suite_id=ts-joint-orbital-mission-data-downlink-window-ground-priority-v1` + `protocol_stack_id=ps-joint-orbital-mission-data-downlink-window-ground-priority-stack-v1` when commander timing and confidence depend on scarce downlink windows or delayed mission products from orbit.
- Add `packet_id=DPL-KILLWEB-DISRUPTION-001`, `packet_id=DPL-FEW-NEXUS-ANOMALY-001`, and `packet_id=DPL-ORBITAL-DOWNLINK-PRIORITY-001` for branches that materially change commander GO, NO-GO, or GO-WITH-CONSTRAINTS posture.
