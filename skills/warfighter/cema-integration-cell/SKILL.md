---
name: cema-integration-cell
description: Integrate cyber and electromagnetic activities into joint operations. Use when synchronizing cyber effects, EW actions, and information actions with maneuver and fires.
---

# CEMA Integration Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using domain-specific inputs and command objectives.
2. Identify assumptions, decision thresholds, and what reporting would invalidate the current plan.
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

Primary products for this skill: CEMA synchronization matrix, effects-to-objectives crosswalk, cyber-EW deconfliction plan.

## External Tools and Protocol Integration

- Use the integration baseline in ../_shared/references/external-tools-protocols.md and name the exact tools selected for this mission set.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Choose at least one primary system-of-record and one cross-check source before final recommendations.
- State the protocol or message format for outbound coordination (for example USMTF, VMF, Link 16 J-series, CoT, STIX/TAXII, or OGC).
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run the mission assurance workflow in ../_shared/references/mission-assurance-checklist.md before final release.
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


## Domain Toolchain Override (2026-03-13, Expansion Wave XXVIII Addendum)

- Add `tool_suite_id=ts-special-operations-low-signature-mesh-trust-v1` + `protocol_stack_id=ps-special-operations-low-signature-mesh-trust-stack-v1` when CEMA recommendations depend on disconnected low-signature mesh trust and key-material survivability.
- Add `tool_suite_id=ts-battlefield-neuromorphic-sensor-anomaly-triage-v1` + `protocol_stack_id=ps-battlefield-neuromorphic-sensor-anomaly-triage-stack-v1` when EW/spectrum posture is shaped by uncertain neuromorphic sensor anomalies.
- Add `packet_id=DPL-SOF-LOW-SIGNATURE-MESH-TRUST-001` and `packet_id=DPL-NEUROMORPHIC-SENSOR-TRIAGE-001` for branches that materially alter spectrum-emissions, deception, or mission data-trust posture.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXIX Addendum)

- Add `tool_suite_id=ts-joint-autonomous-battlefield-mesh-key-ceremony-v1` + `protocol_stack_id=ps-joint-autonomous-battlefield-mesh-key-ceremony-stack-v1` when electromagnetic-cyber integration outputs depend on rapid trust restoration after mesh key compromise.
- Add `tool_suite_id=ts-theater-solar-flare-satcom-fallback-priority-v1` + `protocol_stack_id=ps-theater-solar-flare-satcom-fallback-priority-stack-v1` when solar activity and spectrum stress jointly constrain SATCOM mission traffic.
- Add `packet_id=DPL-MESH-KEY-CEREMONY-001` and `packet_id=DPL-SOLAR-FLARE-SATCOM-FALLBACK-001` for branches that can alter command-and-control continuity posture.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXI Addendum)

- Add `tool_suite_id=ts-joint-low-earth-orbit-satcom-traffic-priority-denial-recovery-v1` + `protocol_stack_id=ps-joint-low-earth-orbit-satcom-traffic-priority-denial-recovery-stack-v1` when CEMA recommendations depend on resilient SATCOM prioritization under jamming and denial.
- Add `tool_suite_id=ts-joint-civil-internet-blackout-military-mesh-bridging-v1` + `protocol_stack_id=ps-joint-civil-internet-blackout-military-mesh-bridging-stack-v1` when electromagnetic and cyber disruption degrade civil-military backbone continuity.
- Add `tool_suite_id=ts-contested-data-center-water-cooling-failure-load-shedding-v1` + `protocol_stack_id=ps-contested-data-center-water-cooling-failure-load-shedding-stack-v1` when mission-network survivability depends on thermal-stressed compute load shedding.
- Add `tool_suite_id=ts-coalition-maritime-fiber-landing-station-kinetic-cyber-defense-v1` + `protocol_stack_id=ps-coalition-maritime-fiber-landing-station-kinetic-cyber-defense-stack-v1` when CEMA posture depends on landing-station cable defense and rapid cyber attribution.
- Add `packet_id=DPL-JOINT-LEO-SATCOM-PRIORITY-DENIAL-RECOVERY-001`, `packet_id=DPL-JOINT-CIVIL-INTERNET-BLACKOUT-MESH-BRIDGING-001`, `packet_id=DPL-CONTESTED-DATACENTER-COOLING-LOADSHED-001`, and `packet_id=DPL-COALITION-MARITIME-FIBER-LANDING-KINETIC-CYBER-DEFENSE-001` for branches that alter emission-control, network-hardening, or command continuity posture.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXII Addendum)

- Add `tool_suite_id=ts-theater-hardened-fiber-satcom-hybrid-command-backbone-v1` + `protocol_stack_id=ps-theater-hardened-fiber-satcom-hybrid-command-backbone-stack-v1` when CEMA recommendations depend on resilient command transport across simultaneous cyber and electromagnetic disruption.
- Add `tool_suite_id=ts-joint-undersea-chokepoint-acoustic-decoy-adjudication-v1` + `protocol_stack_id=ps-joint-undersea-chokepoint-acoustic-decoy-adjudication-stack-v1` when electromagnetic and undersea sensing posture depends on decoy discrimination confidence.
- Add `tool_suite_id=ts-tactical-loitering-munition-swarm-priority-defense-v1` + `protocol_stack_id=ps-tactical-loitering-munition-swarm-priority-defense-stack-v1` when CEMA branches rely on swarm-track fidelity and defended-asset release sequencing.
- Add `tool_suite_id=ts-coalition-border-biometric-watchlist-disruption-recovery-v1` + `protocol_stack_id=ps-coalition-border-biometric-watchlist-disruption-recovery-stack-v1` when cyber disruption to identity/watchlist systems degrades coalition operational trust.
- Add `packet_id=DPL-THEATER-HARDENED-FIBER-SATCOM-HYBRID-COMMAND-BACKBONE-001`, `packet_id=DPL-JOINT-UNDERSEA-CHOKEPOINT-ACOUSTIC-DECOY-ADJUDICATION-001`, `packet_id=DPL-TACTICAL-LOITERING-MUNITION-SWARM-PRIORITY-DEFENSE-001`, and `packet_id=DPL-COALITION-BORDER-BIOMETRIC-WATCHLIST-DISRUPTION-RECOVERY-001` for branches that alter CEMA release posture, emissions governance, or command continuity assumptions.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXIII Addendum)

- Add `tool_suite_id=ts-joint-undersea-cable-repeater-salvage-rapid-restoration-v1` + `protocol_stack_id=ps-joint-undersea-cable-repeater-salvage-rapid-restoration-stack-v1` when CEMA recommendations depend on restoring undersea command pathways after combined cyber-kinetic disruption.
- Add `tool_suite_id=ts-homeland-port-ransomware-manifest-recovery-customs-triage-v1` + `protocol_stack_id=ps-homeland-port-ransomware-manifest-recovery-customs-triage-stack-v1` when cyber effects on port manifest systems drive mission logistics and customs continuity risk.
- Add `tool_suite_id=ts-joint-urban-tunnel-spectrum-navigation-hostage-recovery-v1` + `protocol_stack_id=ps-joint-urban-tunnel-spectrum-navigation-hostage-recovery-stack-v1` when electromagnetic posture and navigation trust shape subterranean hostage-recovery branches.
- Add `tool_suite_id=ts-expeditionary-river-crossing-autonomy-ew-deconfliction-v1` + `protocol_stack_id=ps-expeditionary-river-crossing-autonomy-ew-deconfliction-stack-v1` when CEMA branch outcomes rely on EW deconfliction and autonomous maneuver-corridor release timing.
- Add `packet_id=DPL-JOINT-UNDERSEA-CABLE-REPEATER-SALVAGE-RESTORATION-001`, `packet_id=DPL-HOMELAND-PORT-RANSOMWARE-MANIFEST-RECOVERY-CUSTOMS-TRIAGE-001`, `packet_id=DPL-JOINT-URBAN-TUNNEL-SPECTRUM-NAV-HOSTAGE-RECOVERY-001`, and `packet_id=DPL-EXPEDITIONARY-RIVER-CROSSING-AUTONOMY-EW-DECONFLICTION-001` for branches that alter CEMA release posture, emissions governance, or mission-network continuity assumptions.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXIV Addendum)

- Add `tool_suite_id=ts-tactical-drone-swarm-emp-hardening-mission-recovery-v1` + `protocol_stack_id=ps-tactical-drone-swarm-emp-hardening-mission-recovery-stack-v1` when CEMA recommendations depend on EMP hardening confidence and rapid tactical mission-thread reconstitution.
- Add `tool_suite_id=ts-joint-quantum-pnt-fallback-submarine-strike-deconfliction-v1` + `protocol_stack_id=ps-joint-quantum-pnt-fallback-submarine-strike-deconfliction-stack-v1` when electromagnetic-cyber posture affects denied-navigation timing confidence and submarine strike deconfliction.
- Add `tool_suite_id=ts-joint-deep-undersea-repair-rights-adjudication-restoration-v1` + `protocol_stack_id=ps-joint-deep-undersea-repair-rights-adjudication-restoration-stack-v1` when CEMA continuity depends on undersea repair-rights adjudication for combined cyber-kinetic restoration branches.
- Add `tool_suite_id=ts-theater-forward-microreactor-fuel-security-blackstart-v1` + `protocol_stack_id=ps-theater-forward-microreactor-fuel-security-blackstart-stack-v1` when CEMA release posture depends on forward microreactor sabotage response and blackstart synchronization.
- Add `packet_id=DPL-TACTICAL-DRONE-SWARM-EMP-HARDENING-MISSION-RECOVERY-001`, `packet_id=DPL-JOINT-QUANTUM-PNT-FALLBACK-SUBMARINE-STRIKE-DECONFLICTION-001`, `packet_id=DPL-JOINT-DEEP-UNDERSEA-REPAIR-RIGHTS-ADJUDICATION-RESTORATION-001`, and `packet_id=DPL-THEATER-FORWARD-MICROREACTOR-FUEL-SECURITY-BLACKSTART-001` for branches that alter CEMA release posture, emissions governance, or command-network continuity assumptions.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXV Addendum)

- Add `tool_suite_id=ts-theater-electromagnetic-decoy-corridor-civil-aviation-protection-v1` + `protocol_stack_id=ps-theater-electromagnetic-decoy-corridor-civil-aviation-protection-stack-v1` when CEMA recommendations depend on decoy-emission control with civil aviation safety constraints.
- Add `tool_suite_id=ts-strategic-quantum-network-ops-center-cyber-resilience-v1` + `protocol_stack_id=ps-strategic-quantum-network-ops-center-cyber-resilience-stack-v1` when mission-network trust depends on quantum key-custody recovery and strategic cyber containment.
- Add `tool_suite_id=ts-joint-strategic-hypersonic-launch-attribution-escalation-control-v1` + `protocol_stack_id=ps-joint-strategic-hypersonic-launch-attribution-escalation-control-stack-v1` when CEMA posture and escalation decisions depend on trusted launch attribution and time-sensitive warning integrity.
- Add `tool_suite_id=ts-joint-space-constellation-safe-mode-recovery-priority-v1` + `protocol_stack_id=ps-joint-space-constellation-safe-mode-recovery-priority-stack-v1` when CEMA continuity depends on restoring contested constellation services and mission-priority links.
- Add `packet_id=DPL-THEATER-ELECTROMAGNETIC-DECOY-CORRIDOR-CIVIL-AVIATION-PROTECTION-001`, `packet_id=DPL-STRATEGIC-QUANTUM-NETWORK-OPERATIONS-CYBER-RESILIENCE-001`, `packet_id=DPL-JOINT-STRATEGIC-HYPERSONIC-LAUNCH-ATTRIBUTION-ESCALATION-CONTROL-001`, and `packet_id=DPL-JOINT-SPACE-CONSTELLATION-SAFE-MODE-RECOVERY-MISSION-PRIORITY-001` for branches that alter CEMA emissions governance, release posture, or command-network continuity assumptions.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXVI Addendum)

- Add `tool_suite_id=ts-theater-ai-air-defense-iff-spoofing-recovery-v1` + `protocol_stack_id=ps-theater-ai-air-defense-iff-spoofing-recovery-stack-v1` when CEMA recommendations depend on resilient identification confidence under contested electronic deception.
- Add `tool_suite_id=ts-joint-orbital-spectrum-interference-attribution-mission-deconfliction-v1` + `protocol_stack_id=ps-joint-orbital-spectrum-interference-attribution-mission-deconfliction-stack-v1` when CEMA posture depends on attributed orbital-spectrum interference and mission deconfliction timing.
- Add `tool_suite_id=ts-theater-electronic-warfare-civil-gps-fallback-precision-fire-safeguard-v1` + `protocol_stack_id=ps-theater-electronic-warfare-civil-gps-fallback-precision-fire-safeguard-stack-v1` when electromagnetic effects degrade navigation trust and precision-fire safety assurance.
- Add `tool_suite_id=ts-coalition-cross-border-battlefield-cloud-reconstitution-data-integrity-v1` + `protocol_stack_id=ps-coalition-cross-border-battlefield-cloud-reconstitution-data-integrity-stack-v1` when cyber-electromagnetic recommendations depend on cross-border cloud integrity recovery.
- Add `packet_id=DPL-THEATER-AI-AIR-DEFENSE-IFF-SPOOFING-RECOVERY-001`, `packet_id=DPL-JOINT-ORBITAL-SPECTRUM-INTERFERENCE-ATTRIBUTION-MISSION-DECONFLICTION-001`, `packet_id=DPL-THEATER-ELECTRONIC-WARFARE-CIVIL-GPS-FALLBACK-PRECISION-FIRE-SAFEGUARD-001`, and `packet_id=DPL-COALITION-CROSS-BORDER-BATTLEFIELD-CLOUD-RECONSTITUTION-DATA-INTEGRITY-001` for branches that alter CEMA release posture, emissions governance, or command-network continuity assumptions.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXXVII Addendum)

- Add `tool_suite_id=ts-theater-quantum-resistant-datalink-key-rollover-emission-discipline-v1` + `protocol_stack_id=ps-theater-quantum-resistant-datalink-key-rollover-emission-discipline-stack-v1` when CEMA recommendations depend on cryptographic datalink trust restoration and emission-control governance.
- Add `tool_suite_id=ts-theater-undersea-autonomous-decoy-discrimination-submarine-lane-assurance-v1` + `protocol_stack_id=ps-theater-undersea-autonomous-decoy-discrimination-submarine-lane-assurance-stack-v1` when CEMA posture depends on undersea decoy discrimination confidence and submarine lane release timing.
- Add `tool_suite_id=ts-tactical-denied-pnt-precision-fires-human-override-safety-v1` + `protocol_stack_id=ps-tactical-denied-pnt-precision-fires-human-override-safety-stack-v1` when electromagnetic and cyber pressure degrades navigation trust for precision-fire release.
- Add `tool_suite_id=ts-joint-arctic-subsea-sensor-grid-reseed-ice-threat-forecast-v1` + `protocol_stack_id=ps-joint-arctic-subsea-sensor-grid-reseed-ice-threat-forecast-stack-v1` when CEMA continuity depends on resilient Arctic undersea sensing and warning confidence.
- Add `packet_id=DPL-THEATER-QUANTUM-RESISTANT-DATALINK-KEY-ROLLOVER-EMISSION-DISCIPLINE-001`, `packet_id=DPL-THEATER-UNDERSEA-AUTONOMOUS-DECOY-DISCRIMINATION-SUBMARINE-LANE-ASSURANCE-001`, `packet_id=DPL-TACTICAL-DENIED-PNT-PRECISION-FIRES-HUMAN-OVERRIDE-SAFETY-001`, and `packet_id=DPL-JOINT-ARCTIC-SUBSEA-SENSOR-GRID-RESEED-ICE-THREAT-FORECAST-001` for branches that alter CEMA release posture, emissions governance, or command-network continuity assumptions.

## Domain Toolchain Override (2026-03-13, Expansion Wave XL Addendum)

- Add `tool_suite_id=ts-joint-weather-radar-spectrum-deconfliction-v1` + `protocol_stack_id=ps-joint-weather-radar-spectrum-deconfliction-stack-v1` when CEMA posture depends on preserving radar-enabled weather confidence while enforcing emission-control discipline.
- Add `tool_suite_id=ts-joint-space-launch-range-spectrum-deconfliction-v1` + `protocol_stack_id=ps-joint-space-launch-range-spectrum-deconfliction-stack-v1` when launch-range telemetry and spectrum arbitration affect mission-network or orbital release timing.
- Add `tool_suite_id=ts-tactical-civil-evacuation-public-address-auth-v1` + `protocol_stack_id=ps-tactical-civil-evacuation-public-address-auth-stack-v1` when contested messaging, spoofed broadcasts, or civic trust degradation affect civil-protection branches.
- Add `tool_suite_id=ts-joint-disconnected-mission-ai-model-update-attestation-v1` + `protocol_stack_id=ps-joint-disconnected-mission-ai-model-update-attestation-stack-v1` when cyber-electromagnetic recommendations depend on trusted AI update provenance and rollback-safe release.
- Add `packet_id=DPL-JOINT-WEATHER-RADAR-SPECTRUM-DECONFLICTION-001`, `packet_id=DPL-JOINT-SPACE-LAUNCH-RANGE-SPECTRUM-DECONFLICTION-001`, `packet_id=DPL-TACTICAL-CIVIL-EVACUATION-PUBLIC-ADDRESS-AUTH-001`, and `packet_id=DPL-JOINT-DISCONNECTED-AI-MODEL-UPDATE-ATTESTATION-001` for branches that alter CEMA release posture, emissions governance, or command-network continuity assumptions.
