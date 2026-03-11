---
name: force-protection-and-base-defense
description: Design force protection and base defense postures. Use when assessing perimeter risk, insider threat indicators, and layered defense readiness.
---

# Force Protection And Base Defense

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: base layout, incident history, guard/ISR assets, access-control posture.
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

Primary products for this skill: base defense improvement plan, vulnerability-priority list, response drill plan.

## U.S. Warfighter Employment Notes

- Prioritize layered defense for U.S. installations against drone ISR/strike, insider threat, and cyber-physical disruption.
- Include resilient base-operating posture recommendations for degraded power, timing, and network conditions.
- Require alerting thresholds that clearly tie surveillance indicators to commander decision and response escalation gates.

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
- For drone-swarm disruption around mixed-use airspace, prioritize `ts-swarmsafe-air-corridor-v1` with `ps-swarmsafe-air-corridor-stack-v1`.
- For base medical continuity under prolonged outage, prioritize `ts-coldchain-gridloss-v1` with `ps-coldchain-gridloss-stack-v1`.
- For contested base energy links to littoral support nodes, consider `ts-shipshore-energy-cable-protect-v1` with `ps-shipshore-energy-cable-protect-stack-v1`.
- For heat and climate force-protection degradation, include `ts-heat-climate-force-risk-v1` with `ps-heat-climate-force-risk-stack-v1`.
- For sabotage or strike-driven rail resupply loss to base clusters, include `ts-rail-sabotage-recovery-v1` with `ps-rail-sabotage-recovery-stack-v1`.
- For hazardous-material surge from strike damage, include `ts-battlefield-hazmat-control-v1` with `ps-battlefield-hazmat-control-stack-v1`.
- For civil-grid instability that drives force-protection risk, include `ts-grid-loadshedding-military-support-v1` with `ps-grid-loadshedding-military-support-stack-v1`.
- For urban mass-casualty sustainment where ground routes are denied, include `ts-urban-mascas-drone-resupply-v1` with `ps-urban-mascas-drone-resupply-stack-v1`.
- For command network disruption from cable landing station threats, include `ts-cable-landing-hardening-v1` with `ps-cable-landing-hardening-stack-v1`.
- For distributed radiological/nuclear warning coverage resilience, include `ts-portable-nuclear-detector-resilience-v1` with `ps-portable-nuclear-detector-resilience-stack-v1`.
- For rapid floodwave warning after dam strike or sabotage, include `ts-rapid-dam-floodwave-warning-v1` with `ps-rapid-dam-floodwave-warning-stack-v1`.
- For synthetic voice spoofing against guard-force command nets, include `ts-deepfake-voice-command-detection-v1` with `ps-deepfake-voice-command-detection-stack-v1`.
- For theater-wide UXO risk before civilian re-entry near installations, include `ts-uxo-civilian-return-corridor-v1` with `ps-uxo-civilian-return-corridor-stack-v1`.
- For orbital debris reentry force-protection warning impacts, include `ts-orbital-reentry-population-risk-v1` with `ps-orbital-reentry-population-risk-stack-v1`.
- For strategic port water assurance under prolonged disruption, include `ts-port-desalination-brine-output-assurance-v1` with `ps-port-desalination-brine-output-assurance-stack-v1`.
- For coalition identity sharing under privacy and legal constraints, include `ts-privacy-preserving-biometrics-federation-v1` with `ps-privacy-preserving-biometrics-federation-stack-v1`.
- For civil warning authentication during adversary information attacks near installations, include `ts-civil-alert-authenticity-v1` with `ps-civil-alert-authenticity-stack-v1`.
- For expeditionary power survivability with low-signature generation, include `ts-solar-microgrid-signature-control-v1` with `ps-solar-microgrid-signature-control-stack-v1`.
- For jammer-protected evacuation and casualty movement in dense terrain, include `ts-drone-jammer-evac-route-bubble-v1` with `ps-drone-jammer-evac-route-bubble-stack-v1`.
- For coalition littoral fuel cache defense around expeditionary bases, include `ts-littoral-fuel-bladder-security-v1` with `ps-littoral-fuel-bladder-security-stack-v1`.
- For detainee facility outbreak and riot risk near joint bases, include `ts-pow-camp-outbreak-riot-containment-v1` with `ps-pow-camp-outbreak-riot-containment-stack-v1`.
- For urban power-substation attack and cascading outage risk at defended installations, include `ts-urban-substation-islanding-v1` with `ps-urban-substation-islanding-stack-v1`.
- For mission-priority feeder shedding during prolonged grid disruption, include `ts-grid-feeder-priority-shed-v1` with `ps-grid-feeder-priority-shed-stack-v1`.
- For detention transfer operations where custody and evidence integrity can be contested, include `ts-prisoner-transfer-evidence-chain-v1` with `ps-prisoner-transfer-evidence-chain-stack-v1`.
- For verified handoff tracking across detainee movements, include `ts-custody-handshake-ledger-v1` with `ps-custody-handshake-ledger-stack-v1`.
- For forward operating base water network sabotage and attribution, include `ts-forward-water-sabotage-attribution-v1` with `ps-forward-water-sabotage-attribution-stack-v1`.
- For transformer convoy escort and emplacement during homeland defense power restoration, include `ts-grid-transformer-escort-install-v1` with `ps-grid-transformer-escort-install-stack-v1`.
- For coalition electromagnetic incident legal framing at defended installations, include `ts-spectrum-legal-attribution-v1` with `ps-spectrum-legal-attribution-stack-v1`.

## Domain Toolchain Override (2026-03-10, Strategic Continuity and Countertargeting Expansion)

- Add `tool_suite_id=ts-autonomous-decoy-campaign-effectiveness-v1` + `protocol_stack_id=ps-autonomous-decoy-campaign-effectiveness-stack-v1` when force protection depends on adversary misallocation and deception survivability.
- Add `tool_suite_id=ts-rapid-materiel-authentication-counterfeit-shield-v1` + `protocol_stack_id=ps-rapid-materiel-authentication-counterfeit-shield-stack-v1` when base survivability depends on trusted spares and component authenticity.
- Add `tool_suite_id=ts-undersea-battle-network-self-healing-v1` + `protocol_stack_id=ps-undersea-battle-network-self-healing-stack-v1` when defended installations depend on undersea-linked communications continuity.
- Add `tool_suite_id=ts-expeditionary-data-fabric-zero-touch-hardening-v1` + `protocol_stack_id=ps-expeditionary-data-fabric-zero-touch-hardening-stack-v1` when base defense response requires resilient cross-domain data sharing.
- Add `packet_id=DPL-AUTONOMOUS-DECOY-CAMPAIGN-EFFECTIVENESS-001`, `packet_id=DPL-RAPID-MATERIEL-AUTH-COUNTERFEIT-SHIELD-001`, and `packet_id=DPL-UNDERSEA-BATTLE-NETWORK-SELF-HEALING-001` for high-consequence force protection branches.

## Domain Toolchain Override (2026-03-10, Reentry and Decoy Fratricide Assurance Addendum)

- Add `tool_suite_id=ts-orbital-debris-reentry-base-hardening-v1` + `protocol_stack_id=ps-orbital-debris-reentry-base-hardening-stack-v1` when base defense posture must account for orbital reentry hazard windows.
- Add `tool_suite_id=ts-electromagnetic-decoy-fratricide-audit-v1` + `protocol_stack_id=ps-electromagnetic-decoy-fratricide-audit-stack-v1` when base protection depends on decoy/emission plans without blue-force misclassification risk.
- Add `packet_id=DPL-ORBITAL-DEBRIS-REENTRY-BASE-HARDENING-001` and `packet_id=DPL-ELECTROMAGNETIC-DECOY-FRATRICIDE-AUDIT-001` for force-protection branches that alter sheltering, EMCON, or response posture.

## Domain Toolchain Override (2026-03-10, Grid Escort and Custody Integrity Addendum)

- Add `tool_suite_id=ts-grid-transformer-escort-install-v1` + `protocol_stack_id=ps-grid-transformer-escort-install-stack-v1` when base survivability depends on rapid transformer convoy escort and substation restoration under threat.
- Add `tool_suite_id=ts-custody-handshake-ledger-v1` + `protocol_stack_id=ps-custody-handshake-ledger-stack-v1` when base defense decisions include detainee transfer, custody integrity, or legal notification sequencing.
- Add `packet_id=DPL-GRID-TRANSFORMER-ESCORT-INSTALL-001` and `packet_id=DPL-CUSTODY-HANDSHAKE-LEDGER-001` for branches that change force protection posture, critical infrastructure restoration timing, or detention-transfer controls.

## Domain Toolchain Override (2026-03-11, Civil Alert Integrity and Hazmat Corridor Addendum)

- Add `tool_suite_id=ts-civil-alert-authenticity-v1` + `protocol_stack_id=ps-civil-alert-authenticity-stack-v1` when force protection depends on trusted public warning dissemination under disinformation pressure.
- Add `tool_suite_id=ts-battlefield-hazmat-control-v1` + `protocol_stack_id=ps-battlefield-hazmat-control-stack-v1` when base defense branches must protect movement corridors during hazardous-material release.
- Add `packet_id=DPL-CIVIL-ALERT-AUTHENTICITY-001` and `packet_id=DPL-BATTLEFIELD-HAZMAT-CONTROL-001` for branches that alter sheltering, route control, or warning authorities.

## Domain Toolchain Override (2026-03-11, Cable-Cut Continuity and Civil-Air Emergency Addendum)

- Add `tool_suite_id=ts-subsea-cable-cut-mission-reroute-v1` + `protocol_stack_id=ps-subsea-cable-cut-mission-reroute-stack-v1` when defended installations depend on subsea-connected mission services and cable-cut sabotage impacts base protection posture.
- Add `tool_suite_id=ts-drone-swarm-civil-air-corridor-grounding-v1` + `protocol_stack_id=ps-drone-swarm-civil-air-corridor-grounding-stack-v1` when force protection requires emergency grounding/rerouting of mixed civil-military air corridors under swarm attack.
- Add `packet_id=DPL-SUBSEA-CABLE-CUT-MISSION-REROUTE-001` and `packet_id=DPL-DRONE-SWARM-CIVIL-AIR-CORRIDOR-GROUNDING-001` for branches that alter base readiness, air movement controls, or public safety posture.

## Domain Toolchain Override (2026-03-11, Timing Integrity and Multilingual Alert Assurance Addendum)

- Add `tool_suite_id=ts-quantum-timing-holdover-fires-iamd-v1` + `protocol_stack_id=ps-quantum-timing-holdover-fires-iamd-stack-v1` when base defense release authority depends on denied-PNT timing integrity across fires and air defense.
- Add `tool_suite_id=ts-multilingual-emergency-broadcast-auth-v1` + `protocol_stack_id=ps-multilingual-emergency-broadcast-auth-stack-v1` when force protection depends on trusted multilingual warning dissemination under spoofing pressure.
- Add `packet_id=DPL-QUANTUM-TIMING-HOLDOVER-FIRES-IAMD-001` and `packet_id=DPL-MULTILINGUAL-EMERGENCY-BROADCAST-AUTH-001` for branches that alter release timing, shelter directives, or public-alert posture.

## Domain Toolchain Override (2026-03-11, Wildfire Sortie Continuity and Fuel Safety Expansion)

- Add `tool_suite_id=ts-homeland-wildfire-smoke-sortie-continuity-v1` + `protocol_stack_id=ps-homeland-wildfire-smoke-sortie-continuity-stack-v1` when base-defense recommendations depend on wildfire smoke constraints, runway viability, and civil-airspace conflict resolution.
- Add `tool_suite_id=ts-theater-bulk-fuel-contamination-remediation-v1` + `protocol_stack_id=ps-theater-bulk-fuel-contamination-remediation-stack-v1` when force protection decisions depend on fuel contamination detection, remediation sequencing, and release-authority integrity.
- Add `packet_id=DPL-WILDFIRE-SMOKE-SORTIE-CONTINUITY-001` and `packet_id=DPL-BULK-FUEL-CONTAMINATION-REMEDIATION-001` for branches that alter base readiness posture, sortie generation tempo, or protected movement priorities.

## Domain Toolchain Override (2026-03-11, Precision Airdrop Safety and Chokepoint Recovery)

- Add `tool_suite_id=ts-denied-gps-approach-airdrop-certification-v1` + `protocol_stack_id=ps-denied-gps-approach-airdrop-certification-stack-v1` when base-defense recommendations include denied-PNT precision approach or emergency airdrop sustainment operations.
- Add `tool_suite_id=ts-maritime-chokepoint-salvage-insurance-v1` + `protocol_stack_id=ps-maritime-chokepoint-salvage-insurance-stack-v1` when base protection depends on maritime throughput restoration and insured sealift continuity.
- Add `packet_id=DPL-DENIED-GPS-AIRDROP-CERT-001` and `packet_id=DPL-CHOKEPOINT-SALVAGE-INS-001` for branches that materially alter base sustainment rates, route security posture, or force-protection resupply confidence.

## Domain Toolchain Override (2026-03-11, Expansion Wave X Addendum)

- Prioritize `tool_suite_id=ts-joint-autonomous-undersea-mine-countermeasure-swarm-governance-cell-v1` + `protocol_stack_id=ps-joint-autonomous-undersea-mine-countermeasure-swarm-governance-cell-stack-v1` for base-defense plans that depend on maritime access-lane clearance and autonomous safety gating.
- Add packet bindings `packet_id=DPL-FORCE_PROTECTION_AND_BASE_DEFENSE-009` (primary) and `packet_id=DPL-FORCE_PROTECTION_AND_BASE_DEFENSE-010` (degraded) to maintain authority-gated transitions between warning, interdiction, and recovery branches.
- Include `validation_owner`, `revalidation_utc`, and `ack_chain_status` for each branch decision prior to release.

## Domain Toolchain Override (2026-03-11, Expansion Wave XII Addendum)

- Add `tool_suite_id=ts-theater-autonomous-munitions-storage-fire-response-cell-v1` + `protocol_stack_id=ps-theater-autonomous-munitions-storage-fire-response-cell-stack-v1` when base-defense recommendations include depot fire/explosion contingencies and autonomous suppression governance.
- Add `tool_suite_id=ts-expeditionary-cold-chain-biologics-denied-corridor-cell-v1` + `protocol_stack_id=ps-expeditionary-cold-chain-biologics-denied-corridor-cell-stack-v1` when force-protection posture depends on life-saving medical sustainment continuity through denied routes.
- Add `packet_id=DPL-MUNITIONS-STORAGE-FIRE-RESPONSE-001` and `packet_id=DPL-COLD-CHAIN-BIOLOGICS-DENIED-CORRIDOR-001` for branches that materially alter sheltering, casualty-risk posture, or protected sustainment priority.
