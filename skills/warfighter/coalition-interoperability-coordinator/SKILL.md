---
name: coalition-interoperability-coordinator
description: Coordinate interoperability with allies and partners. Use when mapping capability gaps, data-sharing boundaries, and procedural differences in combined operations.
---

# Coalition Interoperability Coordinator

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: partner capabilities, comms/data standards, policy constraints, mission requirements.
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

Primary products for this skill: interoperability gap matrix, combined SOP alignment actions, liaison priorities.

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


## Domain Toolchain Override (2026-03-10, Strategic Continuity and Countertargeting Expansion)

- Add `tool_suite_id=ts-strategic-deterrence-signaling-fusion-v1` + `protocol_stack_id=ps-strategic-deterrence-signaling-fusion-stack-v1` when coalition interoperability risk is shaped by deterrence signaling and escalation synchronization.
- Add `tool_suite_id=ts-coalition-cognitive-ew-disinfo-countertargeting-v1` + `protocol_stack_id=ps-coalition-cognitive-ew-disinfo-countertargeting-stack-v1` when cross-alliance decision quality is degraded by coordinated influence and EW deception.
- Add `tool_suite_id=ts-gray-zone-influence-countercampaign-v1` + `protocol_stack_id=ps-gray-zone-influence-countercampaign-stack-v1` for persistent below-threshold competition that affects alliance cohesion and access.
- Add `tool_suite_id=ts-expeditionary-data-fabric-zero-touch-hardening-v1` + `protocol_stack_id=ps-expeditionary-data-fabric-zero-touch-hardening-stack-v1` when coalition interoperability depends on trusted cross-domain data exchange in denied environments.
- Add `packet_id=DPL-STRATEGIC-DETERRENCE-SIGNALING-001`, `packet_id=DPL-COALITION-COGNITIVE-EW-DISINFO-COUNTERTARGETING-001`, and `packet_id=DPL-GRAY-ZONE-INFLUENCE-COUNTERCAMPAIGN-001` for branches that can alter coalition force posture.

## Domain Toolchain Override (2026-03-10, Coalition Urban Air Corridors and Medical Autonomy Addendum)

- Add `tool_suite_id=ts-coalition-urban-drone-traffic-separation-v1` + `protocol_stack_id=ps-coalition-urban-drone-traffic-separation-stack-v1` when interoperability depends on coalition urban drone corridor governance under denied-PNT conditions.
- Add `tool_suite_id=ts-coalition-autonomous-ambulance-drone-corridor-v1` + `protocol_stack_id=ps-coalition-autonomous-ambulance-drone-corridor-stack-v1` when coalition casualty movement relies on autonomous air corridors and cross-border medical routing approvals.
- Add `packet_id=DPL-COALITION-URBAN-DRONE-TRAFFIC-SEPARATION-001` and `packet_id=DPL-COALITION-AUTONOMOUS-AMBULANCE-DRONE-CORRIDOR-001` for branches that alter coalition airspace and casualty-flow governance.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXIII Addendum)

- Add `tool_suite_id=ts-orbital-servicing-refuel-assurance-v1` + `protocol_stack_id=ps-orbital-servicing-refuel-assurance-stack-v1` when recommendations depend on contested space-logistics servicing continuity, custody confidence, or maneuver-safe refuel timing.
- Add `tool_suite_id=ts-denied-terrain-drone-resupply-nav-v1` + `protocol_stack_id=ps-denied-terrain-drone-resupply-nav-stack-v1` when branch viability depends on autonomous resupply route confidence through denied terrain.
- Add `tool_suite_id=ts-coalition-cable-landing-data-sovereignty-v1` + `protocol_stack_id=ps-coalition-cable-landing-data-sovereignty-stack-v1` when recommendations depend on sovereign data routing, coalition caveats, or cable-landing continuity.
- Add `tool_suite_id=ts-runway-ice-fog-autoland-assurance-v1` + `protocol_stack_id=ps-runway-ice-fog-autoland-assurance-stack-v1` when mission tempo is constrained by low-visibility runway conditions and autoland safety confidence.
- Add `packet_id=DPL-ORBITAL-SERVICING-REFUEL-001`, `packet_id=DPL-DENIED-TERRAIN-DRONE-RESUPPLY-001`, `packet_id=DPL-COALITION-CABLE-LANDING-SOVEREIGNTY-001`, and `packet_id=DPL-RUNWAY-ICE-FOG-AUTOLAND-001` for branches that materially alter commander GO/NO-GO posture.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXV Addendum)

- Prioritize `tool_suite_id=ts-joint-cislunar-logistics-interdiction-reconstitution-v1` with `protocol_stack_id=ps-joint-cislunar-logistics-interdiction-reconstitution-stack-v1` when strategic space logistics, custody confidence, or cislunar maneuver assurance directly affect mission risk decisions.
- Add `tool_suite_id=ts-theater-underwater-datacenter-cooling-grid-defense-v1` with `protocol_stack_id=ps-theater-underwater-datacenter-cooling-grid-defense-stack-v1` when mission outcomes depend on underwater compute resilience, cooling continuity, or cyber-physical load restoration.
- Add `packet_id=DPL-CISLUNAR-LOGISTICS-INTERDICTION-001` and `packet_id=DPL-UNDERWATER-DATACENTER-COOLING-DEFENSE-001` for recommendations that alter mission posture, contingency branches, or strategic continuity authorities.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXVII Addendum)

- Add `tool_suite_id=ts-theater-cislunar-logistics-custody-conjunction-assurance-v1` + `protocol_stack_id=ps-theater-cislunar-logistics-custody-conjunction-assurance-stack-v1` when coalition interoperability planning depends on shared cislunar custody status, conjunction confidence, and release authorities.
- Add `tool_suite_id=ts-joint-biosurveillance-field-lab-chain-of-custody-v1` + `protocol_stack_id=ps-joint-biosurveillance-field-lab-chain-of-custody-stack-v1` when coalition force-health and bio-event sharing require evidence-grade sample custody and cross-border validation.
- Add `tool_suite_id=ts-strategic-cognitive-electromagnetic-deception-exposure-v1` + `protocol_stack_id=ps-strategic-cognitive-electromagnetic-deception-exposure-stack-v1` when allied interoperability decisions are degraded by combined disinformation and spectrum-deception pressure.
- Add `packet_id=DPL-CISLUNAR-CUSTODY-CONJUNCTION-001`, `packet_id=DPL-BIOSURVEILLANCE-FIELD-LAB-CUSTODY-001`, and `packet_id=DPL-COGNITIVE-EM-DECEPTION-EXPOSURE-001` for branches that can alter coalition posture or release authorities.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXVIII Addendum)

- Add `tool_suite_id=ts-coalition-deepfake-c2-authenticity-validation-v1` + `protocol_stack_id=ps-coalition-deepfake-c2-authenticity-validation-stack-v1` when coalition order integrity is threatened by synthetic media or spoofed command traffic.
- Add `tool_suite_id=ts-coalition-rare-earth-supply-shock-priority-allocation-v1` + `protocol_stack_id=ps-coalition-rare-earth-supply-shock-priority-allocation-stack-v1` when interoperability risk is driven by mission-critical component scarcity across allied force packages.
- Add `packet_id=DPL-COALITION-DEEPFAKE-C2-AUTH-001` and `packet_id=DPL-COALITION-RARE-EARTH-ALLOCATION-001` for recommendations that alter coalition release authorities or readiness-sharing assumptions.
- Add `tool_suite_id=ts-coalition-medical-oxygen-anesthetic-surge-v1` + `protocol_stack_id=ps-coalition-medical-oxygen-anesthetic-surge-stack-v1` when coalition interoperability decisions depend on shared oxygen/anesthetic medical logistics and surgical throughput continuity.
- Add `tool_suite_id=ts-coalition-rotary-wing-dustoff-contested-weather-routing-v1` + `protocol_stack_id=ps-coalition-rotary-wing-dustoff-contested-weather-routing-stack-v1` when interoperability recommendations depend on cross-border medevac route governance under contested weather and airspace.
- Add `packet_id=DPL-COALITION-MEDICAL-OXYGEN-ANESTHETIC-SURGE-001` and `packet_id=DPL-COALITION-ROTARY-WING-DUSTOFF-WEATHER-ROUTING-001` for branches that alter coalition casualty-flow governance or clinical resource release authorities.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXI Addendum)

- Add `tool_suite_id=ts-coalition-ai-targeting-policy-explainability-audit-v1` + `protocol_stack_id=ps-coalition-ai-targeting-policy-explainability-audit-stack-v1` when coalition release confidence depends on explainable AI-assisted targeting.
- Add `tool_suite_id=ts-coalition-maritime-fiber-landing-station-kinetic-cyber-defense-v1` + `protocol_stack_id=ps-coalition-maritime-fiber-landing-station-kinetic-cyber-defense-stack-v1` when allied interoperability depends on landing-station cable continuity under combined kinetic/cyber threat.
- Add `tool_suite_id=ts-joint-civil-internet-blackout-military-mesh-bridging-v1` + `protocol_stack_id=ps-joint-civil-internet-blackout-military-mesh-bridging-stack-v1` when coalition command sharing depends on civil-military mesh fallback pathways.
- Add `packet_id=DPL-COALITION-AI-TARGETING-EXPLAINABILITY-AUDIT-001`, `packet_id=DPL-COALITION-MARITIME-FIBER-LANDING-KINETIC-CYBER-DEFENSE-001`, and `packet_id=DPL-JOINT-CIVIL-INTERNET-BLACKOUT-MESH-BRIDGING-001` for branches that materially alter coalition authority gates or cross-domain release timelines.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXII Addendum)

- Add `tool_suite_id=ts-coalition-maritime-autonomous-convoy-fuel-denial-mitigation-v1` + `protocol_stack_id=ps-coalition-maritime-autonomous-convoy-fuel-denial-mitigation-stack-v1` when coalition interoperability recommendations depend on autonomous convoy fuel continuity and lane release governance.
- Add `tool_suite_id=ts-coalition-border-biometric-watchlist-disruption-recovery-v1` + `protocol_stack_id=ps-coalition-border-biometric-watchlist-disruption-recovery-stack-v1` when cross-border interoperability confidence depends on watchlist restoration and identity assurance.
- Add `tool_suite_id=ts-theater-civilian-hospital-overflow-military-triage-synchronization-v1` + `protocol_stack_id=ps-theater-civilian-hospital-overflow-military-triage-synchronization-stack-v1` when coalition casualty-flow coordination depends on synchronized hospital-overflow triage governance.
- Add `tool_suite_id=ts-theater-hardened-fiber-satcom-hybrid-command-backbone-v1` + `protocol_stack_id=ps-theater-hardened-fiber-satcom-hybrid-command-backbone-stack-v1` when interoperability planning depends on hybrid command-backbone survivability under cyber-kinetic disruption.
- Add `packet_id=DPL-COALITION-MARITIME-AUTONOMOUS-CONVOY-FUEL-DENIAL-MITIGATION-001`, `packet_id=DPL-COALITION-BORDER-BIOMETRIC-WATCHLIST-DISRUPTION-RECOVERY-001`, `packet_id=DPL-THEATER-CIVILIAN-HOSPITAL-OVERFLOW-MILITARY-TRIAGE-SYNCHRONIZATION-001`, and `packet_id=DPL-THEATER-HARDENED-FIBER-SATCOM-HYBRID-COMMAND-BACKBONE-001` for branches that materially alter coalition authority gates, caveat handling, or release timelines.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXIII Addendum)

- Add `tool_suite_id=ts-coalition-legal-mission-data-release-evidence-assurance-v1` + `protocol_stack_id=ps-coalition-legal-mission-data-release-evidence-assurance-stack-v1` when interoperability recommendations depend on coalition releasability, legal caveats, and evidence-chain assurance.
- Add `tool_suite_id=ts-coalition-arctic-icebreaker-convoy-port-denial-recovery-v1` + `protocol_stack_id=ps-coalition-arctic-icebreaker-convoy-port-denial-recovery-stack-v1` when coalition sustainment interoperability depends on Arctic convoy routing and denied-port recovery governance.
- Add `tool_suite_id=ts-coalition-prisoner-exchange-biometric-legal-chain-sync-v1` + `protocol_stack_id=ps-coalition-prisoner-exchange-biometric-legal-chain-sync-stack-v1` when coalition recommendations depend on detainee identity confidence and legal handoff synchronization.
- Add `tool_suite_id=ts-space-domain-cislunar-conjunction-rescue-asset-priority-v1` + `protocol_stack_id=ps-space-domain-cislunar-conjunction-rescue-asset-priority-stack-v1` when coalition space interoperability depends on cislunar custody coordination and rescue-window arbitration.
- Add `packet_id=DPL-COALITION-LEGAL-MISSION-DATA-RELEASE-EVIDENCE-ASSURANCE-001`, `packet_id=DPL-COALITION-ARCTIC-ICEBREAKER-CONVOY-PORT-DENIAL-RECOVERY-001`, `packet_id=DPL-COALITION-PRISONER-EXCHANGE-BIOMETRIC-LEGAL-CHAIN-SYNC-001`, and `packet_id=DPL-SPACE-CISLUNAR-CONJUNCTION-RESCUE-ASSET-PRIORITY-001` for branches that materially alter coalition authority gates, caveat handling, or release timelines.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXIV Addendum)

- Add `tool_suite_id=ts-coalition-autonomous-humanitarian-airlift-airspace-liability-v1` + `protocol_stack_id=ps-coalition-autonomous-humanitarian-airlift-airspace-liability-stack-v1` when coalition interoperability recommendations depend on autonomous humanitarian airlift corridor governance and host-nation liability controls.
- Add `tool_suite_id=ts-coalition-legal-autonomous-weapons-incident-investigation-v1` + `protocol_stack_id=ps-coalition-legal-autonomous-weapons-incident-investigation-stack-v1` when coalition release confidence depends on autonomous-weapon incident legal forensics and evidence-chain integrity.
- Add `tool_suite_id=ts-space-domain-cislunar-sustainment-legal-governance-cargo-priority-v1` + `protocol_stack_id=ps-space-domain-cislunar-sustainment-legal-governance-cargo-priority-stack-v1` when interoperability planning depends on coalition cislunar custody synchronization and legal cargo-priority governance.
- Add `tool_suite_id=ts-joint-deep-undersea-repair-rights-adjudication-restoration-v1` + `protocol_stack_id=ps-joint-deep-undersea-repair-rights-adjudication-restoration-stack-v1` when coalition continuity depends on adjudicated undersea repair-rights and restoration authority alignment.
- Add `packet_id=DPL-COALITION-AUTONOMOUS-HUMANITARIAN-AIRLIFT-AIRSPACE-LIABILITY-001`, `packet_id=DPL-COALITION-LEGAL-AUTONOMOUS-WEAPONS-INCIDENT-INVESTIGATION-001`, `packet_id=DPL-SPACE-DOMAIN-CISLUNAR-SUSTAINMENT-LEGAL-GOVERNANCE-CARGO-PRIORITY-001`, and `packet_id=DPL-JOINT-DEEP-UNDERSEA-REPAIR-RIGHTS-ADJUDICATION-RESTORATION-001` for branches that materially alter coalition authority gates, caveat handling, or release timelines.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXV Addendum)

- Add `tool_suite_id=ts-coalition-cross-border-undersea-power-cable-sabotage-response-v1` + `protocol_stack_id=ps-coalition-cross-border-undersea-power-cable-sabotage-response-stack-v1` when coalition interoperability recommendations depend on cross-border power-cable restoration and legal authority synchronization.
- Add `tool_suite_id=ts-coalition-medical-biobank-cold-chain-genomics-assurance-v1` + `protocol_stack_id=ps-coalition-medical-biobank-cold-chain-genomics-assurance-stack-v1` when interoperability planning depends on coalition clinical data trust, sample custody, and cold-chain continuity.
- Add `tool_suite_id=ts-joint-civilian-evacuation-biometric-family-reunification-integrity-v1` + `protocol_stack_id=ps-joint-civilian-evacuation-biometric-family-reunification-integrity-stack-v1` when coalition recommendations depend on trusted biometric identity reconciliation and cross-border reunification governance.
- Add `tool_suite_id=ts-homeland-911-cell-broadcast-auth-mass-notification-continuity-v1` + `protocol_stack_id=ps-homeland-911-cell-broadcast-auth-mass-notification-continuity-stack-v1` when coalition public-warning interoperability depends on authenticated broadcast trust and emergency notification continuity.
- Add `packet_id=DPL-COALITION-CROSS-BORDER-UNDERSEA-POWER-CABLE-SABOTAGE-RESPONSE-001`, `packet_id=DPL-COALITION-MEDICAL-BIOBANK-COLD-CHAIN-BATTLEFIELD-GENOMICS-ASSURANCE-001`, `packet_id=DPL-JOINT-CIVILIAN-EVACUATION-BIOMETRIC-FAMILY-REUNIFICATION-INTEGRITY-001`, and `packet_id=DPL-HOMELAND-911-CELL-BROADCAST-AUTHENTICATION-MASS-NOTIFICATION-CONTINUITY-001` for branches that materially alter coalition authority gates or release timelines.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXVI Addendum)

- Add `tool_suite_id=ts-coalition-under-ice-subsea-fiber-repair-sovereign-data-routing-v1` + `protocol_stack_id=ps-coalition-under-ice-subsea-fiber-repair-sovereign-data-routing-stack-v1` when coalition interoperability depends on sovereign routing caveats and under-ice cable restoration authorities.
- Add `tool_suite_id=ts-coalition-humanitarian-seaport-biosecurity-screening-military-throughput-v1` + `protocol_stack_id=ps-coalition-humanitarian-seaport-biosecurity-screening-military-throughput-stack-v1` when coalition throughput recommendations depend on harmonized biosecurity and military cargo governance.
- Add `tool_suite_id=ts-coalition-cross-border-battlefield-cloud-reconstitution-data-integrity-v1` + `protocol_stack_id=ps-coalition-cross-border-battlefield-cloud-reconstitution-data-integrity-stack-v1` when coalition release confidence depends on battlefield-cloud data-integrity attestations.
- Add `tool_suite_id=ts-joint-orbital-spectrum-interference-attribution-mission-deconfliction-v1` + `protocol_stack_id=ps-joint-orbital-spectrum-interference-attribution-mission-deconfliction-stack-v1` when coalition space interoperability decisions depend on shared orbital interference attribution confidence.
- Add `packet_id=DPL-COALITION-UNDER-ICE-SUBSEA-FIBER-REPAIR-SOVEREIGN-DATA-ROUTING-001`, `packet_id=DPL-COALITION-HUMANITARIAN-SEAPORT-BIOSECURITY-SCREENING-MILITARY-THROUGHPUT-001`, `packet_id=DPL-COALITION-CROSS-BORDER-BATTLEFIELD-CLOUD-RECONSTITUTION-DATA-INTEGRITY-001`, and `packet_id=DPL-JOINT-ORBITAL-SPECTRUM-INTERFERENCE-ATTRIBUTION-MISSION-DECONFLICTION-001` for branches that materially alter coalition authority gates or release timelines.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXVII Addendum)

- Add `tool_suite_id=ts-coalition-forward-airfield-counter-drone-rearming-sortie-resilience-v1` + `protocol_stack_id=ps-coalition-forward-airfield-counter-drone-rearming-sortie-resilience-stack-v1` when coalition interoperability decisions depend on shared counter-drone posture and sortie generation governance.
- Add `tool_suite_id=ts-coalition-border-refugee-biometric-deconfliction-insider-risk-screening-v1` + `protocol_stack_id=ps-coalition-border-refugee-biometric-deconfliction-insider-risk-screening-stack-v1` when recommendations depend on cross-border identity trust, legal caveats, and insider-risk screening synchronization.
- Add `tool_suite_id=ts-joint-cislunar-propellant-depot-custody-emergency-rendezvous-v1` + `protocol_stack_id=ps-joint-cislunar-propellant-depot-custody-emergency-rendezvous-stack-v1` when coalition space interoperability depends on custody confidence and rendezvous release deconfliction.
- Add `tool_suite_id=ts-homeland-port-radiological-screening-surge-military-sealift-continuity-v1` + `protocol_stack_id=ps-homeland-port-radiological-screening-surge-military-sealift-continuity-stack-v1` when coalition interoperability depends on harmonized port screening and sealift throughput coordination.
- Add `packet_id=DPL-COALITION-FORWARD-AIRFIELD-COUNTER-DRONE-REARMING-SORTIE-RESILIENCE-001`, `packet_id=DPL-COALITION-BORDER-REFUGEE-BIOMETRIC-DECONFLICTION-INSIDER-RISK-SCREENING-001`, `packet_id=DPL-JOINT-CISLUNAR-PROPELLANT-DEPOT-CUSTODY-EMERGENCY-RENDEZVOUS-001`, and `packet_id=DPL-HOMELAND-PORT-RADIOLOGICAL-SCREENING-SURGE-MILITARY-SEALIFT-CONTINUITY-001` for branches that materially alter coalition authority gates or release timelines.

## Domain Toolchain Override (2026-03-13, Expansion Wave XL Addendum)

- Add `tool_suite_id=ts-coalition-merchant-marine-crew-vetting-sealift-assurance-v1` + `protocol_stack_id=ps-coalition-merchant-marine-crew-vetting-sealift-assurance-stack-v1` when coalition interoperability depends on trusted merchant crew release, sanctions compliance, and sealift manning continuity.
- Add `tool_suite_id=ts-tactical-civil-evacuation-public-address-auth-v1` + `protocol_stack_id=ps-tactical-civil-evacuation-public-address-auth-stack-v1` when coalition humanitarian or civil-protection messaging must remain trusted across languages, caveats, and alert channels.
- Add `tool_suite_id=ts-strategic-commercial-port-crane-firmware-rollback-sealift-recovery-v1` + `protocol_stack_id=ps-strategic-commercial-port-crane-firmware-rollback-sealift-recovery-stack-v1` when coalition sealift interoperability depends on trusted port OT recovery and berth-priority synchronization.
- Add `tool_suite_id=ts-joint-space-launch-range-spectrum-deconfliction-v1` + `protocol_stack_id=ps-joint-space-launch-range-spectrum-deconfliction-stack-v1` when allied launch support or range-spectrum sharing affects coalition release timelines.
- Add `packet_id=DPL-COALITION-MERCHANT-MARINE-CREW-VETTING-SEALIFT-001`, `packet_id=DPL-TACTICAL-CIVIL-EVACUATION-PUBLIC-ADDRESS-AUTH-001`, `packet_id=DPL-STRATEGIC-PORT-CRANE-FIRMWARE-ROLLBACK-SEALIFT-001`, and `packet_id=DPL-JOINT-SPACE-LAUNCH-RANGE-SPECTRUM-DECONFLICTION-001` for branches that materially alter coalition authority gates or release timelines.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLI Addendum)

- Add `tool_suite_id=ts-coalition-medical-credential-revocation-reprivileging-v1` + `protocol_stack_id=ps-coalition-medical-credential-revocation-reprivileging-stack-v1` when coalition interoperability depends on cross-border clinician trust, emergency privileging, or clinical caveat reconciliation.
- Add `tool_suite_id=ts-multi-theater-maritime-interdiction-evidence-sanctions-v1` + `protocol_stack_id=ps-multi-theater-maritime-interdiction-evidence-sanctions-stack-v1` when coalition maritime release timelines depend on harmonized legal evidence, sanctions sufficiency, and custody standards.
- Add `tool_suite_id=ts-strategic-domestic-transport-chokepoint-reroute-v1` + `protocol_stack_id=ps-strategic-domestic-transport-chokepoint-reroute-stack-v1` when coalition reception, staging, onward movement, or sealift handoff depends on U.S. domestic infrastructure reroutes.
- Add `tool_suite_id=ts-joint-cislunar-timing-trust-collision-mitigation-v1` + `protocol_stack_id=ps-joint-cislunar-timing-trust-collision-mitigation-stack-v1` when allied space-support interoperability depends on shared timing trust, custody confidence, or conjunction release timing.
- Add `packet_id=DPL-COALITION-MEDICAL-CREDENTIAL-REPRIVILEGING-001`, `packet_id=DPL-MULTI-THEATER-MARITIME-INTERDICTION-EVIDENCE-SANCTIONS-001`, `packet_id=DPL-STRATEGIC-DOMESTIC-TRANSPORT-CHOKEPOINT-REROUTE-001`, and `packet_id=DPL-JOINT-CISLUNAR-TIMING-COLLISION-MITIGATION-001` for branches that materially alter coalition authority gates or release timelines.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLII Addendum)

- Add `tool_suite_id=ts-joint-tactical-legal-attribution-synthesis-v1` + `protocol_stack_id=ps-joint-tactical-legal-attribution-synthesis-stack-v1` when coalition interoperability decisions depend on shared evidentiary confidence and releasable attribution language.
- Add `tool_suite_id=ts-coalition-minefield-humanitarian-corridor-integrity-v1` + `protocol_stack_id=ps-coalition-minefield-humanitarian-corridor-integrity-stack-v1` when coalition coordination must preserve humanitarian maritime access under mine threat and route caveats.
- Add `tool_suite_id=ts-joint-sovereign-edge-cloud-migration-v1` + `protocol_stack_id=ps-joint-sovereign-edge-cloud-migration-stack-v1` when interoperable data exchange depends on trusted sovereign or edge compute cutovers.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVI Addendum)

- Add `tool_suite_id=ts-theater-battlefield-cloud-federation-admission-control-v1` + `protocol_stack_id=ps-theater-battlefield-cloud-federation-admission-control-stack-v1` when coalition data exchange depends on controlled workload admission, enclave isolation, or releasability boundaries across federated clouds.
- Add `tool_suite_id=ts-coalition-denied-sar-beacon-authentication-v1` + `protocol_stack_id=ps-coalition-denied-sar-beacon-authentication-stack-v1` when partner-force recovery timing depends on trusted distress-beacon authentication and coalition identity challenge paths.
- Add `tool_suite_id=ts-joint-ai-order-intent-integrity-v1` + `protocol_stack_id=ps-joint-ai-order-intent-integrity-stack-v1` when machine-generated combined orders, translations, or delegated tasking require commander-intent fidelity checks before coalition release.
- Add `packet_id=DPL-BATTLEFIELD-CLOUD-ADMISSION-001`, `packet_id=DPL-COALITION-SAR-BEACON-AUTH-001`, and `packet_id=DPL-AI-ORDER-INTENT-001` for branches that materially alter coalition release confidence, partner trust, or combined-force tempo.
- Add `packet_id=DPL-TACTICAL-LEGAL-ATTRIB-001`, `packet_id=DPL-MINEFIELD-HUMCOR-001`, and `packet_id=DPL-SOVEREIGN-EDGE-CLOUD-001` for branches that materially change coalition release, access, or continuity decisions.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIV Addendum)

- Add `tool_suite_id=ts-coalition-munitions-end-use-serial-trace-v1` + `protocol_stack_id=ps-coalition-munitions-end-use-serial-trace-stack-v1` when coalition interoperability depends on serial-level transfer accountability, diversion suppression, or releasable munitions auditability.
- Add `tool_suite_id=ts-joint-commercial-sat-imagery-retask-governance-v1` + `protocol_stack_id=ps-joint-commercial-sat-imagery-retask-governance-stack-v1` when coalition awareness depends on negotiated access to commercial imagery under denial, contractual friction, or sovereignty caveats.
- Add `tool_suite_id=ts-theater-spectrum-autonomy-convoy-integrity-v1` + `protocol_stack_id=ps-theater-spectrum-autonomy-convoy-integrity-stack-v1` when coalition convoy interoperability depends on trusted autonomy fallback, human override, and spectrum-aware movement control.
- Add `packet_id=DPL-MUNITIONS-END-USE-SERIAL-TRACE-001`, `packet_id=DPL-COMMERCIAL-SAT-IMAGERY-RETASK-001`, and `packet_id=DPL-SPECTRUM-AUTONOMY-CONVOY-INTEGRITY-001` for branches that materially change coalition transfer trust, shared awareness, or convoy-release posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLV Addendum)

- Add `tool_suite_id=ts-coalition-host-nation-civil-airlift-clearance-v1` + `protocol_stack_id=ps-coalition-host-nation-civil-airlift-clearance-stack-v1` when interoperability depends on coalition civil-airlift access, diplomatic clearances, or mixed-crew ramp sequencing.
- Add `tool_suite_id=ts-coalition-underway-replenishment-rig-compatibility-v1` + `protocol_stack_id=ps-coalition-underway-replenishment-rig-compatibility-stack-v1` when coalition sustainment depends on compatible UNREP hoses, spanwires, or transfer certifications.
- Add `tool_suite_id=ts-joint-digital-order-watermark-recall-v1` + `protocol_stack_id=ps-joint-digital-order-watermark-recall-stack-v1` when releasable orders or shared tasking messages may be stale, spoofed, or version-divergent across coalition distribution paths.
- Add `packet_id=DPL-COALITION-CIVIL-AIRLIFT-CLEARANCE-001`, `packet_id=DPL-UNDERWAY-REPLENISHMENT-RIG-001`, and `packet_id=DPL-DIGITAL-ORDER-WATERMARK-001` for branches that materially change coalition access, afloat sustainment trust, or shared command-path confidence.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVII Addendum)

- Add `tool_suite_id=ts-coalition-shore-power-frequency-conversion-berthing-v1` + `protocol_stack_id=ps-coalition-shore-power-frequency-conversion-berthing-stack-v1` when coalition berth timing, pier power compatibility, or converter scarcity shapes port interoperability.
- Add `tool_suite_id=ts-joint-laser-designator-sensor-fratricide-prevention-v1` + `protocol_stack_id=ps-joint-laser-designator-sensor-fratricide-prevention-stack-v1` when combined fires or coalition JTAC support depends on trusted laser-code and sensor deconfliction.
- Add `tool_suite_id=ts-theater-cloud-credential-burn-access-reconstitution-v1` + `protocol_stack_id=ps-theater-cloud-credential-burn-access-reconstitution-stack-v1` when coalition data exchange depends on restoring federated identity trust after credential compromise.
- Add `packet_id=DPL-SHORE-POWER-BERTHING-001`, `packet_id=DPL-LASER-DESIGNATOR-FRATRICIDE-001`, and `packet_id=DPL-CLOUD-CREDENTIAL-BURN-001` for branches that materially change coalition access, combined-fires trust, or federated-network release posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVIII Addendum)

- Add `tool_suite_id=ts-coalition-mission-data-releasability-waiver-adjudication-v1` + `protocol_stack_id=ps-coalition-mission-data-releasability-waiver-adjudication-stack-v1` when coalition tempo depends on auditable caveat waivers, schema reduction, or foreign-disclosure decisions.
- Add `tool_suite_id=ts-joint-distributed-mission-brief-multilingual-assurance-v1` + `protocol_stack_id=ps-joint-distributed-mission-brief-multilingual-assurance-stack-v1` when interoperability depends on preserving commander intent across multilingual briefs and disconnected partner distribution paths.
- Add `tool_suite_id=ts-coalition-fuel-energy-water-nexus-anomaly-adjudication-v1` + `protocol_stack_id=ps-coalition-fuel-energy-water-nexus-anomaly-adjudication-stack-v1` when coalition support decisions depend on reconciling utility anomalies across shared bases, ports, or treatment nodes.
- Add `packet_id=DPL-RELEASABILITY-WAIVER-001`, `packet_id=DPL-MULTILINGUAL-MISSION-BRIEF-001`, and `packet_id=DPL-FEW-NEXUS-ANOMALY-001` for branches that materially change coalition release, translation trust, or shared-support posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIX Addendum)

- Add `tool_suite_id=ts-coalition-detainee-appeals-custody-transparency-v1` + `protocol_stack_id=ps-coalition-detainee-appeals-custody-transparency-stack-v1` when interoperability depends on common detainee appeals handling, translation quality, or custody-transparency trust.
- Add `tool_suite_id=ts-joint-personnel-recovery-family-auth-deception-denial-v1` + `protocol_stack_id=ps-joint-personnel-recovery-family-auth-deception-denial-stack-v1` when coalition recovery coordination depends on trusted family messaging, survivor authentication, or spoof denial.
- Add `packet_id=DPL-DETAINEE-APPEALS-CUSTODY-001` and `packet_id=DPL-PR-FAMILY-AUTH-DECEPTION-001` for branches that materially change coalition legitimacy, detainee compliance, or shared recovery confidence.

## Domain Toolchain Override (2026-03-15, Expansion Wave LV Addendum)

- Add `tool_suite_id=ts-theater-spectrum-license-host-nation-regulatory-emissions-continuity-v1` + `protocol_stack_id=ps-theater-spectrum-license-host-nation-regulatory-emissions-continuity-stack-v1` when coalition interoperability depends on host-nation regulatory waivers, spectrum legality, or emergency emissions continuity.
- Add `tool_suite_id=ts-joint-contested-ceasefire-hotline-escalation-control-v1` + `protocol_stack_id=ps-joint-contested-ceasefire-hotline-escalation-control-stack-v1` when combined-force confidence depends on authenticated ceasefire incident routing and escalation-control acknowledgment chains.
- Add `tool_suite_id=ts-coalition-mission-digital-twin-baseline-reconciliation-v1` + `protocol_stack_id=ps-coalition-mission-digital-twin-baseline-reconciliation-stack-v1` when coalition technical interoperability depends on release-safe digital-twin baselines and configuration drift reconciliation.
- Add `packet_id=DPL-SPECTRUM-LICENSE-REGULATORY-001`, `packet_id=DPL-CEASEFIRE-HOTLINE-ESCALATION-001`, and `packet_id=DPL-DIGITAL-TWIN-BASELINE-001` for branches that materially change coalition release confidence, cross-domain legality, or combined-force tempo.

## Domain Toolchain Override (2026-03-15, Expansion Wave LVI Gap-Closure Addendum)

- Add `tool_suite_id=ts-joint-operational-law-judge-advocate-advisory-v1` + `protocol_stack_id=ps-joint-operational-law-judge-advocate-advisory-stack-v1` when coalition interoperability recommendations depend on shared authority language, legal caveats, or protected advisory chains.
- Add `tool_suite_id=ts-joint-air-mobility-diplomatic-clearance-staging-v1` + `protocol_stack_id=ps-joint-air-mobility-diplomatic-clearance-staging-stack-v1` when coalition lift access depends on host-nation diplomatic clearances, staging capacity, or mixed-force ramp sequencing.
- Add `tool_suite_id=ts-joint-orbital-warfare-effects-deconfliction-v1` + `protocol_stack_id=ps-joint-orbital-warfare-effects-deconfliction-stack-v1` when partner interoperability depends on shared protected-service continuity, conjunction confidence, or escalation-safe orbital coordination.
- Add `tool_suite_id=ts-joint-expeditionary-advanced-base-signature-management-v1` + `protocol_stack_id=ps-joint-expeditionary-advanced-base-signature-management-stack-v1` when coalition littoral posture depends on releasable signature budgets, displacement timing, or austere support choreography.
- Add `packet_id=DPL-JUDGE-ADVOCATE-OPLAW-001`, `packet_id=DPL-AIR-MOBILITY-DIPCLEAR-STAGING-001`, `packet_id=DPL-ORBITAL-WARFARE-DECONFLICTION-001`, and `packet_id=DPL-EABO-SIGNATURE-MANAGEMENT-001` for branches that materially change coalition access, releasability, or combined-force continuity decisions.

## Domain Toolchain Override (2026-03-15, Expansion Wave LIX Addendum)

- Add `tool_suite_id=ts-coalition-partner-force-insider-threat-advisor-protection-v1` + `protocol_stack_id=ps-coalition-partner-force-insider-threat-advisor-protection-stack-v1` when coalition interoperability depends on trusted counterpart vetting, advisor movement protection, or shared insider-risk acknowledgment.
- Add `tool_suite_id=ts-coalition-host-nation-force-protection-claims-liability-v1` + `protocol_stack_id=ps-coalition-host-nation-force-protection-claims-liability-stack-v1` when coalition access, burden-sharing, or host-nation legitimacy depends on claims and liability transparency after incidents.
- Add `packet_id=DPL-PARTNER-FORCE-INSIDER-ADVISOR-001` and `packet_id=DPL-HOST-NATION-FP-CLAIMS-LIABILITY-001` for branches that materially alter coalition release confidence, host-nation trust, or advisor mission continuity.

## Domain Toolchain Override (2026-03-15, Expansion Wave LXI Addendum)

- Add `tool_suite_id=ts-coalition-ballast-water-biosecurity-port-clearance-v1` + `protocol_stack_id=ps-coalition-ballast-water-biosecurity-port-clearance-stack-v1` when coalition port access depends on harmonized ballast-water screening, quarantine thresholds, or berth-release sequencing.
- Add `tool_suite_id=ts-joint-offline-key-material-courier-compromise-v1` + `protocol_stack_id=ps-joint-offline-key-material-courier-compromise-stack-v1` when combined-force interoperability depends on trusted courier-based rekey, COMSEC custody, or compromise notification across disconnected partners.
- Add `packet_id=DPL-BALLAST-WATER-PORT-CLEARANCE-001` and `packet_id=DPL-OFFLINE-KEY-MATERIAL-COURIER-001` for branches that materially change coalition access, shared command trust, or release timelines.

## Domain Toolchain Override (2026-03-15, Expansion Wave LXII Addendum)

- Add `tool_suite_id=ts-coalition-portable-water-testing-biosecurity-corridor-v1` + `protocol_stack_id=ps-coalition-portable-water-testing-biosecurity-corridor-stack-v1` when coalition corridor legitimacy depends on shared water assurance, field sanitation confidence, or biosecurity gating.
- Add `tool_suite_id=ts-coalition-refugee-camp-energy-water-cyber-harmonization-v1` + `protocol_stack_id=ps-coalition-refugee-camp-energy-water-cyber-harmonization-stack-v1` when interoperability depends on common utility restoration, humanitarian data handling, or cyber-containment rules across displaced-person sites.
- Add `tool_suite_id=ts-coalition-arctic-bulk-fuel-blending-freeze-point-assurance-v1` + `protocol_stack_id=ps-coalition-arctic-bulk-fuel-blending-freeze-point-assurance-stack-v1` when coalition sustainment trust depends on common fuel blending, freeze-point validation, or cold-weather release criteria.
- Add `packet_id=DPL-WATER-BIOSEC-CORRIDOR-001`, `packet_id=DPL-REFUGEE-CAMP-EW-CYBER-001`, and `packet_id=DPL-ARCTIC-FUEL-FREEZE-001` for branches that materially change coalition release posture, humanitarian interoperability, or Arctic sustainment confidence.

## Domain Toolchain Override (2026-03-15, Expansion Wave LXIII Addendum)

- Add `tool_suite_id=ts-coalition-harbor-salvage-diving-uxo-dock-clearance-v1` + `protocol_stack_id=ps-coalition-harbor-salvage-diving-uxo-dock-clearance-stack-v1` when coalition port reopening depends on diver-certification reciprocity, UXO confidence, or berth-authority alignment.
- Add `tool_suite_id=ts-coalition-cross-border-casualty-credentialing-blood-compatibility-v1` + `protocol_stack_id=ps-coalition-cross-border-casualty-credentialing-blood-compatibility-stack-v1` when coalition casualty routing depends on clinician credential reciprocity, blood-standard interoperability, or emergency border clearance.
- Add `packet_id=DPL-HARBOR-SALVAGE-UXO-001` and `packet_id=DPL-CROSS-BORDER-CASUALTY-CREDENTIALING-001` for branches that materially change coalition access, medical-routing legitimacy, or combined-force survivability confidence.

## Domain Toolchain Override (2026-03-15, Expansion Wave LXIV Addendum)

- Add `tool_suite_id=ts-coalition-human-remains-dna-custody-cross-border-release-v1` + `protocol_stack_id=ps-coalition-human-remains-dna-custody-cross-border-release-stack-v1` when coalition interoperability depends on shared mortuary custody standards, DNA confidence, or cross-border release legitimacy.
- Add `tool_suite_id=ts-coalition-ration-dietary-compliance-allergen-assurance-v1` + `protocol_stack_id=ps-coalition-ration-dietary-compliance-allergen-assurance-stack-v1` when combined sustainment depends on harmonized allergen controls, medical diets, or religious-feeding caveats.
- Add `packet_id=DPL-HUMAN-REMAINS-DNA-001` and `packet_id=DPL-RATION-ALLERGEN-001` for branches that materially change coalition release confidence, legal sufficiency, or combined-force sustainment legitimacy.

## Domain Toolchain Override (2026-03-15, Expansion Wave LXVI Addendum)

- Add `tool_suite_id=ts-coalition-civil-port-labor-strike-sealift-continuity-v1` + `protocol_stack_id=ps-coalition-civil-port-labor-strike-sealift-continuity-stack-v1` when coalition interoperability depends on aligned berth priorities, host-nation labor coordination, or sealift reroute legitimacy.
- Add `tool_suite_id=ts-coalition-ai-foreign-disclosure-guardrail-v1` + `protocol_stack_id=ps-coalition-ai-foreign-disclosure-guardrail-stack-v1` when shared mission-AI access depends on releasability discipline, model provenance, or partner guardrail enforcement.
- Add `tool_suite_id=ts-battlefield-grave-registration-interment-site-integrity-v1` + `protocol_stack_id=ps-battlefield-grave-registration-interment-site-integrity-stack-v1` when combined-force accountability depends on temporary interment-site documentation, protection, or later recovery confidence.
- Add `packet_id=DPL-PORT-LABOR-SEALIFT-CONTINUITY-001`, `packet_id=DPL-COALITION-AI-GUARDRAILS-001`, and `packet_id=DPL-BATTLEFIELD-GRAVE-REGISTRATION-001` for branches that materially change coalition release posture, partner-access trust, or multinational remains-accountability legitimacy.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXVII Addendum)

- Add `tool_suite_id=ts-coalition-casualty-language-consent-v1` + `protocol_stack_id=ps-coalition-casualty-language-consent-stack-v1` when coalition interoperability depends on multilingual casualty handoffs, consent validity, or treatment-caveat reconciliation.
- Add `tool_suite_id=ts-expeditionary-seabed-landing-zone-causeway-placement-v1` + `protocol_stack_id=ps-expeditionary-seabed-landing-zone-causeway-placement-stack-v1` when combined littoral entry depends on shared hydrographic confidence, causeway-release timing, or shore-party handoff legitimacy.
- Add `tool_suite_id=ts-theater-mortuary-cold-chain-dna-ledger-v1` + `protocol_stack_id=ps-theater-mortuary-cold-chain-dna-ledger-stack-v1` when partner coordination depends on remains-accountability confidence, DNA custody, or transfer legitimacy.
- Add `packet_id=DPL-COALITION-CASUALTY-CONSENT-001`, `packet_id=DPL-CAUSEWAY-LANDING-ZONE-001`, and `packet_id=DPL-MORTUARY-DNA-LEDGER-001` for branches that materially change coalition medical legitimacy, amphibious interoperability, or multinational accountability trust.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXVIII Addendum)

- Add `tool_suite_id=ts-joint-host-nation-legislative-liaison-mandate-alignment-v1` + `protocol_stack_id=ps-joint-host-nation-legislative-liaison-mandate-alignment-stack-v1` when coalition interoperability depends on synchronized host-nation emergency powers, legislative waivers, or authority translation.
- Add `tool_suite_id=ts-theater-allied-civilian-contractor-readiness-force-protection-v1` + `protocol_stack_id=ps-theater-allied-civilian-contractor-readiness-force-protection-stack-v1` when combined-force execution depends on contractor vetting reciprocity, protected movement, or mission-essential service continuity.
- Add `tool_suite_id=ts-theater-evacuation-route-humanitarian-logistics-traffic-priority-v1` + `protocol_stack_id=ps-theater-evacuation-route-humanitarian-logistics-traffic-priority-stack-v1` when coalition coordination depends on shared evacuation corridors, humanitarian traffic priorities, or border-crossing deconfliction.
- Add `tool_suite_id=ts-joint-military-financial-liability-compensation-continuity-v1` + `protocol_stack_id=ps-joint-military-financial-liability-compensation-continuity-stack-v1` when coalition legitimacy depends on aligned compensation posture, liability transparency, or emergency claims routing after incidents.
- Add `packet_id=DPL-HOSTNATION-MANDATE-ALIGNMENT-001`, `packet_id=DPL-CONTRACTOR-READINESS-FP-001`, `packet_id=DPL-EVAC-HUMLOG-TRAFFIC-001`, and `packet_id=DPL-FIN-LIABILITY-COMPENSATION-001` for branches that materially change coalition release posture, partner trust, or access legitimacy.
