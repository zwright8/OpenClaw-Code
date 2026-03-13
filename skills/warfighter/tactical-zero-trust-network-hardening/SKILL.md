---
name: tactical-zero-trust-network-hardening
description: Design practical zero-trust controls for tactical and expeditionary networks without breaking mission tempo. Use when units need resilient identity, segmentation, and degraded-mode cyber operations.
---

# Tactical Zero Trust Network Hardening

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: network topology, mission apps, identity providers, contested comms assumptions, recovery priorities.
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

Primary products for this skill: tactical zero-trust implementation plan, segmentation policy set, degraded ops playbook.

## External Tools and Protocol Integration

- Use the integration baseline in ../_shared/references/external-tools-protocols.md.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Prioritize these tools or tool families for this domain: IdM/PKI systems, SIEM/SOAR, endpoint and network telemetry tools.
- Specify outbound exchange format for recommendations and tasking (for example USMTF, VMF, Link 16 J-series, CoT, STIX/TAXII, OGC WMS/WFS/WMTS).
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

## Zero-Trust Continuity Addendum (2026-03-10, Identity Reconstitution and Command Intent Sync)

- Add `tool_suite_id=ts-identity-proof-life-reconstitution-v1` + `protocol_stack_id=ps-identity-proof-life-reconstitution-stack-v1` when disconnected identity confidence falls below mission threshold or proof-of-life status is stale.
- Add `tool_suite_id=ts-disconnected-command-intent-reconciliation-v1` + `protocol_stack_id=ps-disconnected-command-intent-reconciliation-stack-v1` when command guidance forks create competing execution paths across tactical enclaves.
- Add `packet_id=DPL-IDENTITY-PROOF-LIFE-RECON-001` and `packet_id=DPL-DISCONNECTED-COMMAND-INTENT-RECON-001` for branches that alter authorization boundaries, credential trust, or command release conditions.

## Zero-Trust Expansion Addendum (2026-03-11, Denied Navigation and Convoy Counter-Ambush)

- Add `tool_suite_id=ts-denied-pnt-terrain-nav-recovery-v1` + `protocol_stack_id=ps-denied-pnt-terrain-nav-recovery-stack-v1` when zero-trust routing policy must preserve assured maneuver timing under GNSS spoofing/jamming.
- Add `tool_suite_id=ts-autonomous-convoy-counter-ambush-v1` + `protocol_stack_id=ps-autonomous-convoy-counter-ambush-stack-v1` when tactical network hardening recommendations directly impact autonomous convoy branch execution.
- Add `packet_id=DPL-DENIED-PNT-RECOVERY-001` and `packet_id=DPL-CONVOY-COUNTER-AMBUSH-001` for recommendations that shift trust boundaries, route authority, or engagement-risk posture.

## Zero-Trust Expansion Addendum (2026-03-11, Undersea Restoration and Coalition Cyber-EM Fusion)

- Add `tool_suite_id=ts-undersea-cable-restoration-traffic-priority-v1` + `protocol_stack_id=ps-undersea-cable-restoration-traffic-priority-stack-v1` when zero-trust routing policy depends on contested undersea transport restoration and mission traffic arbitration.
- Add `tool_suite_id=ts-coalition-cyber-em-oob-fusion-v1` + `protocol_stack_id=ps-coalition-cyber-em-oob-fusion-stack-v1` when trust posture recommendations require coalition cyber and electromagnetic order-of-battle corroboration.
- Add `packet_id=DPL-UNDERSEA-CABLE-RESTORE-001` and `packet_id=DPL-COALITION-CYBER-EM-FUSION-001` for recommendations that alter identity trust boundaries, network priority lanes, or release authorities.

## Domain Toolchain Override (2026-03-11, Strategic Warning and Evidence-Speed Expansion)

- Add `tool_suite_id=ts-strategic-ai-mobilization-indications-v1` + `protocol_stack_id=ps-strategic-ai-mobilization-indications-stack-v1` when hardening recommendations depend on warning-driven defensive posture shifts against adversary mobilization campaigns.
- Add `tool_suite_id=ts-coalition-ceasefire-evidence-sync-v1` + `protocol_stack_id=ps-coalition-ceasefire-evidence-sync-stack-v1` when network integrity recommendations must preserve legally admissible incident evidence synchronization at coalition boundaries.
- Add `packet_id=DPL-STRAT-MOB-WARN-001` and `packet_id=DPL-CEASEFIRE-EVIDENCE-SYNC-001` for branches that alter sensor trust posture, legal evidence handling, or alliance release controls.

## Domain Toolchain Override (2026-03-11, Expansion Wave X Addendum)

- Prioritize `tool_suite_id=ts-theater-denied-electronic-warfare-mission-data-reprogramming-cell-v1` + `protocol_stack_id=ps-theater-denied-electronic-warfare-mission-data-reprogramming-cell-stack-v1` when EW mission-data reprogramming and tactical trust restoration are interdependent.
- Add packet bindings `packet_id=DPL-TACTICAL_ZERO_TRUST_NETWORK_HARDENING-009` (primary) and `packet_id=DPL-TACTICAL_ZERO_TRUST_NETWORK_HARDENING-010` (degraded) to preserve release-authority traceability under denial.
- Include `validation_owner`, `revalidation_utc`, and `ack_chain_status`; if any are stale, downgrade to advisory-only and escalate to commander network authority.

## Domain Toolchain Override (2026-03-11, Expansion Wave XII Addendum)

- Add `tool_suite_id=ts-tactical-counter-disinformation-civil-signal-assurance-cell-v1` + `protocol_stack_id=ps-tactical-counter-disinformation-civil-signal-assurance-cell-stack-v1` when zero-trust branch recommendations must preserve trusted civil-warning release and command-channel narrative integrity under active information attack.
- Add `tool_suite_id=ts-joint-iamd-multi-node-radar-deception-recovery-cell-v1` + `protocol_stack_id=ps-joint-iamd-multi-node-radar-deception-recovery-cell-stack-v1` when trust-boundary decisions depend on resilient radar-track confidence and rapid deception recovery.
- Add `packet_id=DPL-TACTICAL-COUNTER-DISINFORMATION-SIGNAL-001` and `packet_id=DPL-IAMD-RADAR-DECEPTION-RECOVERY-001` for branches that alter network trust posture, release authority timing, or engagement-risk thresholds.

## Domain Toolchain Override (2026-03-11, Expansion Wave XIII Addendum)

- Add `tool_suite_id=ts-joint-ai-generated-order-integrity-and-commander-intent-deviation-cell-v1` + `protocol_stack_id=ps-joint-ai-generated-order-integrity-and-commander-intent-deviation-cell-stack-v1` when zero-trust recommendations depend on validating AI-authored orders against commander intent.
- Add `tool_suite_id=ts-theater-resilient-battlefield-cloud-federation-admission-control-cell-v1` + `protocol_stack_id=ps-theater-resilient-battlefield-cloud-federation-admission-control-cell-stack-v1` when trust posture depends on cloud federation admission governance under contested operations.
- Add `packet_id=DPL-AI-ORDER-INTEGRITY-001` and `packet_id=DPL-CLOUDFED-ADMISSION-001` for branches that alter trust boundaries, release authorities, or continuity assumptions.

## Domain Toolchain Override (2026-03-11, Expansion Wave XIV Addendum)

- Add `tool_suite_id=ts-coalition-host-nation-fiber-cut-and-backhaul-restoration-cell-v1` + `protocol_stack_id=ps-coalition-host-nation-fiber-cut-and-backhaul-restoration-cell-stack-v1` when trust-boundary recommendations depend on coalition telecom backhaul restoration and releasability-safe routing.
- Add `tool_suite_id=ts-joint-contested-biometric-pay-and-personnel-reconstitution-cell-v1` + `protocol_stack_id=ps-joint-contested-biometric-pay-and-personnel-reconstitution-cell-stack-v1` when disconnected identity confidence and personnel-accountability trust directly impact network authorization posture.
- Add `packet_id=DPL-COALITION-FIBER-BACKHAUL-RESTORE-001` and `packet_id=DPL-BIOMETRIC-PAY-PERSONNEL-RECON-001` for branches that alter identity trust, route authority, or continuity assumptions.

## Domain Toolchain Override (2026-03-12, Expansion Wave XV Addendum)

- Add tool_suite_id=ts-coalition-arctic-fiber-microwave-troposcatter-failover-cell-v1 + protocol_stack_id=ps-coalition-arctic-fiber-microwave-troposcatter-failover-cell-stack-v1 when zero-trust continuity depends on contested arctic transport failover and coalition service-priority routing.
- Add tool_suite_id=ts-joint-quantum-sensing-spoof-detection-governance-cell-v1 + protocol_stack_id=ps-joint-quantum-sensing-spoof-detection-governance-cell-stack-v1 when trust-boundary decisions depend on spoof-resistant sensing confidence and fallback policy control.
- Add packet_id=DPL-ARCTIC-TRANSPORT-FAILOVER-001 and packet_id=DPL-QUANTUM-SENSING-SPOOF-GOV-001 for recommendations that shift identity trust boundaries, route authority, or mission-data confidence thresholds.


## Domain Toolchain Override (2026-03-12, Expansion Wave XVI Addendum)

- Add tool_suite_id=ts-strategic-quantum-network-key-custody-and-compromise-response-cell-v1 + protocol_stack_id=ps-strategic-quantum-network-key-custody-and-compromise-response-cell-stack-v1 when zero-trust posture depends on compromised key-custody containment and cryptographic continuity.
- Add tool_suite_id=ts-homeland-defense-municipal-911-psap-cyber-survivability-cell-v1 + protocol_stack_id=ps-homeland-defense-municipal-911-psap-cyber-survivability-cell-stack-v1 when network trust boundaries must preserve military-civil emergency call continuity.
- Add packet_id=DPL-QUANTUM-NETWORK-KEY-CUSTODY-001 and packet_id=DPL-MUNICIPAL-911-PSAP-CYBER-001 for recommendations that shift trust boundaries, credential release controls, or life-safety communication authorities.

## Domain Toolchain Override (2026-03-12, Expansion Wave XVII Addendum)

- Add tool_suite_id=ts-joint-cyber-mission-assurance-and-hunt-forward-cell-v1 + protocol_stack_id=ps-joint-cyber-mission-assurance-and-hunt-forward-cell-stack-v1 when zero-trust recommendations depend on hunt-forward threat suppression and mission-system survivability across coalition enclaves.
- Add tool_suite_id=ts-joint-space-control-and-counterspace-mission-cell-v1 + protocol_stack_id=ps-joint-space-control-and-counterspace-mission-cell-stack-v1 when trust posture depends on protected space-control telemetry, SATCOM continuity, and escalation-safe counterspace branch controls.
- Add packet_id=DPL-CYBER-HUNT-FWD-001 and packet_id=DPL-SPACE-COUNTERSPACE-001 for recommendations that shift trust boundaries, cross-domain release authority, or strategic continuity assumptions.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXIII Addendum)

- Add `tool_suite_id=ts-orbital-servicing-refuel-assurance-v1` + `protocol_stack_id=ps-orbital-servicing-refuel-assurance-stack-v1` when recommendations depend on contested space-logistics servicing continuity, custody confidence, or maneuver-safe refuel timing.
- Add `tool_suite_id=ts-denied-terrain-drone-resupply-nav-v1` + `protocol_stack_id=ps-denied-terrain-drone-resupply-nav-stack-v1` when branch viability depends on autonomous resupply route confidence through denied terrain.
- Add `tool_suite_id=ts-coalition-cable-landing-data-sovereignty-v1` + `protocol_stack_id=ps-coalition-cable-landing-data-sovereignty-stack-v1` when recommendations depend on sovereign data routing, coalition caveats, or cable-landing continuity.
- Add `tool_suite_id=ts-runway-ice-fog-autoland-assurance-v1` + `protocol_stack_id=ps-runway-ice-fog-autoland-assurance-stack-v1` when mission tempo is constrained by low-visibility runway conditions and autoland safety confidence.
- Add `packet_id=DPL-ORBITAL-SERVICING-REFUEL-001`, `packet_id=DPL-DENIED-TERRAIN-DRONE-RESUPPLY-001`, `packet_id=DPL-COALITION-CABLE-LANDING-SOVEREIGNTY-001`, and `packet_id=DPL-RUNWAY-ICE-FOG-AUTOLAND-001` for branches that materially alter commander GO/NO-GO posture.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXIV Addendum)

- Add `tool_suite_id=ts-joint-cyber-em-spectrum-mission-reroute-v1` + `protocol_stack_id=ps-joint-cyber-em-spectrum-mission-reroute-stack-v1` when mission survivability requires synchronized cyber+EM rerouting under active disruption.
- Add `tool_suite_id=ts-theater-llm-opsec-prompt-injection-defense-v1` + `protocol_stack_id=ps-theater-llm-opsec-prompt-injection-defense-stack-v1` for AI-enabled C2 stacks exposed to prompt injection or retrieval poisoning.
- Add `packet_id=DPL-JOINT-CYBER-EM-REROUTE-001` and `packet_id=DPL-THEATER-LLM-OPSEC-INJECTION-001` for primary and degraded trust-restoration branches.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXV Addendum)

- Prioritize `tool_suite_id=ts-joint-cislunar-logistics-interdiction-reconstitution-v1` with `protocol_stack_id=ps-joint-cislunar-logistics-interdiction-reconstitution-stack-v1` when strategic space logistics, custody confidence, or cislunar maneuver assurance directly affect mission risk decisions.
- Add `tool_suite_id=ts-theater-underwater-datacenter-cooling-grid-defense-v1` with `protocol_stack_id=ps-theater-underwater-datacenter-cooling-grid-defense-stack-v1` when mission outcomes depend on underwater compute resilience, cooling continuity, or cyber-physical load restoration.
- Add `packet_id=DPL-CISLUNAR-LOGISTICS-INTERDICTION-001` and `packet_id=DPL-UNDERWATER-DATACENTER-COOLING-DEFENSE-001` for recommendations that alter mission posture, contingency branches, or strategic continuity authorities.


## Domain Toolchain Override (2026-03-12, Expansion Wave XXVI Addendum)

- Add tool_suite_id=ts-joint-undersea-cable-sabotage-forensics-restoration-v1 + protocol_stack_id=ps-joint-undersea-cable-sabotage-forensics-restoration-stack-v1 when mission-network survivability depends on undersea cable forensics, routing integrity, and restoration sequencing.
- Add packet_id=DPL-UNDERSEA-CABLE-SABOTAGE-FORENSICS-001 for branches that change network trust posture or external routing dependencies.

## Domain Toolchain Override (2026-03-13, Expansion Wave XXVIII Addendum)

- Add `tool_suite_id=ts-theater-deepfake-command-auth-assurance-v1` + `protocol_stack_id=ps-theater-deepfake-command-auth-assurance-stack-v1` when network hardening recommendations must neutralize spoofed command traffic and preserve authenticated command release continuity.
- Add `tool_suite_id=ts-strategic-military-cloud-break-glass-continuity-v1` + `protocol_stack_id=ps-strategic-military-cloud-break-glass-continuity-stack-v1` when trust-boundary decisions depend on sovereign cloud break-glass migration and mission-data custody controls.
- Add `packet_id=DPL-THEATER-DEEPFAKE-COMMAND-AUTH-ASSURANCE-001` and `packet_id=DPL-STRATEGIC-MILITARY-CLOUD-BREAK-GLASS-CONTINUITY-001` for branches that shift trust boundaries, command-release controls, or continuity authority posture.
