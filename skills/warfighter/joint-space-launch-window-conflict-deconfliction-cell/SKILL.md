---
name: joint-space-launch-window-conflict-deconfliction-cell
description: Support U.S. warfighter planning and operational decision support for Joint Space Launch Window Conflict Deconfliction Cell scenarios across joint and coalition mission environments. Use when planning, synchronizing, or adapting operations that require cross-domain coordination under uncertainty.
---

# Joint Space Launch Window Conflict Deconfliction Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: mission analysis, commander intent, assumptions, CCIR, and constraints.
2. Define measurable objectives, risk thresholds, branch conditions, and indicators that invalidate the preferred plan.
3. Build a recommended option and at least two alternatives with explicit tradeoffs in tempo, survivability, sustainment load, and escalation risk.
4. Integrate dependencies across command and control, maneuver, fires/effects, intelligence, protection, sustainment, and information.
5. Convert decisions into execution-ready products with owners, suspense dates, coordination links, and required reports.

## Required Output Format

Deliver results in this order:

1. Situation snapshot: current conditions and key changes since the last update.
2. Recommended option: one clearly stated recommendation and rationale.
3. Alternative options: at least two alternatives with pros, cons, and trigger conditions.
4. Decision points: what must be decided now, later, or pre-delegated.
5. Staff tasking: who does what by when.

## Domain Products

Primary products for this skill: space support effects plan, orbital conflict deconfliction matrix, launch/reconstitution branch triggers.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: space domain awareness catalogs, SATCOM planners, orbital conjunction analyzers, mission assurance dashboards.

## External Tools and Protocol Integration

- Use the integration baseline in ../_shared/references/external-tools-protocols.md and select specific systems-of-record aligned to this mission.
- Use protocol examples in ../_shared/references/tool-protocol-playbooks.md to produce operator-ready tool invocation packets.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded mode stack).
- Use at least one primary source and one cross-check source before final recommendations.
- Prefer these protocol families for this skill: API/JSON, USMTF, Link 16 J-series.
- Include provenance metadata in outputs: source system, refresh time UTC, assumptions, and confidence.

## Interoperability Validation Checklist

- Run mission assurance checks in ../_shared/references/mission-assurance-checklist.md before final release.
- Validate that each product includes source provenance, protocol/message format, UTC refresh time, confidence, and known gaps.
- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Tool Invocation Contract

- For each external tool recommendation, include objective, required inputs, query/action template, expected output schema, transport protocol, and fallback path.
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
- Include packet_id and protocol_profile from the library for each critical recommendation.
- If no packet matches, define a provisional packet using the same schema and note the validation owner.

## Domain Data Contract

- Use mapping guidance in ../_shared/references/joint-mission-data-contracts.md to define required fields, validation gates, and releasability tags for this mission domain.
- Ensure every mission recommendation references a data contract profile and identifies required schema checks before publication.

## Operational Learning Loop

- Use ../_shared/references/operational-learning-and-after-action-loop.md to generate after-action deltas, corrective actions, and readiness metrics.
- Include aar_id, effect-delta assessment, and owner/suspense for each high-impact recommendation.
- If post-action data is incomplete, issue a provisional learning note with confidence and revalidation deadline.

## Readiness Certification Evidence Pack

- Use ../_shared/references/readiness-certification-evidence-pack.md to define mission-essential task evidence, evaluator triggers, and certification confidence scoring.
- Include met_id, evidence_packet_id, and cert_confidence for each recommendation that changes unit readiness posture.
- If required evidence is missing, mark status as provisional and assign closure actions with suspense.

## Protocol Execution Sequence

- Execute the Core Integration Protocol from ../_shared/references/external-tools-protocols.md as an explicit step sequence.
- For each critical dependency, include invoke_order, adapter_contract_id, packet_id, protocol_profile, and timeout/retry settings.
- Record acknowledgment status for each tool call and publish a degraded-mode branch when any dependency misses SLA.
- Require a human command check before acting on outputs that materially change force posture, mission risk, or escalation.

## Domain Toolchain Profile Binding

- Use ../_shared/references/domain-toolchain-profiles.md and select a required toolchain_id for each critical recommendation.
- Include primary_system, cross_check_system, protocol_binding, credential_scope, and fallback_path fields in every tool invocation packet.
- Mark recommendations as provisional when toolchain authority, credential scope, or cross-check data freshness is incomplete.

## Tool Health and Trust Monitoring

- Use ../_shared/references/tool-health-and-trust-monitoring.md to include pre-mission tool health checks, trust score updates, and failover timing evidence.
- Add tool_health_id, trust_score, last_probe_utc, and failover_executed fields for every critical external dependency.
- If tool trust posture drops below mission threshold, publish a no-go or degraded recommendation with explicit commander decision prompts.

## U.S. Joint Protocol Assurance Drill

- Use ../_shared/references/us-joint-protocol-assurance-drill.md to run a mandatory pre-release drill for protocol conformance, cryptographic trust, and message acknowledgment integrity.
- Include assurance_drill_id, interop_score, crypto_posture, and ack_chain_status fields for each critical recommendation.
- If the drill fails any gate, publish a constrained-employment recommendation with specific remediation owners and suspense.

## Joint Operations External Toolchain Profiles

- Use ../_shared/references/joint-operations-external-toolchain-profiles.md to select a mission-fit toolchain_profile_id and bind each recommendation to concrete primary and cross-check tools.
- Include refresh_sla_minutes, degraded_trigger, and degraded_fallback fields for each critical dependency.
- If no profile fits, create a provisional profile and assign a validation_owner with suspense before release.

## Human-Agent Command Escalation Matrix

- Use ../_shared/references/human-agent-command-escalation-matrix.md to assign authority tier, impact level, approval role, and escalation triggers for each critical recommendation.
- Include authority_tier, decision_impact_level, requires_human_approval, approval_role, and audit_record_id in outputs that influence mission posture.
- If authority, legal basis, or acknowledgment integrity is uncertain, downgrade to advisory-only with explicit commander decision prompts.

## Mission Tool Authority Gates

- Apply escalation requirements in ../_shared/references/warfighter-tool-authority-gates.md for high-consequence recommendations.
- Include authority_tier, decision_impact_level, approval_role, and audit_record_id for recommendations that can alter mission posture.
- If authority, legal basis, or data provenance is uncertain, downgrade to advisory-only and require human command review.

## Cross-Domain Integration Playbook

- Use `../_shared/references/cross-domain-integration-playbook.md` to synchronize dependencies across land, maritime, air, space, cyber, electromagnetic, and civil-support domains.
- Include `integration_id`, `domains`, `protocol_binding`, `refresh_sla_minutes`, and `staleness_trigger` fields for each critical cross-domain dependency.
- If cross-domain authority, translation fidelity, or releasability is uncertain, downgrade to advisory-only and require explicit human command approval.

## Mission Tool and Protocol Catalog Binding

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select concrete tool suites and protocol stacks for this domain.
- Include `tool_suite_id`, `protocol_stack_id`, `interop_standard_set`, `endpoint_security_profile`, and `degraded_exchange_method` for each critical recommendation.
- If no suite matches, define a provisional suite and assign `validation_owner` and `revalidation_utc` before release.


## Space Deconfliction Expansion Addendum (2026-03-11, Reentry Warning and Coalition Port Coupling)

- Add `tool_suite_id=ts-orbital-debris-reentry-base-protection-v1` + `protocol_stack_id=ps-orbital-debris-reentry-base-protection-stack-v1` when launch-window deconfliction requires synchronized debris reentry warning branches and base-protection triggers.
- Add `tool_suite_id=ts-contested-port-humanitarian-inspection-v1` + `protocol_stack_id=ps-contested-port-humanitarian-inspection-stack-v1` when launch or reconstitution windows are coupled to contested-port throughput and humanitarian lane governance.
- Add `packet_id=DPL-ORBITAL-REENTRY-PROTECT-001` and `packet_id=DPL-PORT-HUMANITARIAN-DECONF-001` for recommendations that change launch timing, base exposure posture, or coalition movement priorities.

## Space Deconfliction Expansion Addendum (2026-03-11, Ground-Station Ransomware and Timing Resilience Coupling)

- Add `tool_suite_id=ts-satellite-ground-station-ransomware-continuity-v1` + `protocol_stack_id=ps-satellite-ground-station-ransomware-continuity-stack-v1` when launch-window recommendations depend on cyber continuity and command-path integrity across ground stations.
- Add `tool_suite_id=ts-tactical-quantum-pnt-time-distribution-v1` + `protocol_stack_id=ps-tactical-quantum-pnt-time-distribution-stack-v1` when launch deconfliction branches depend on resilient timing holdover and denied-PNT compensation planning.
- Add `packet_id=DPL-SAT-GROUND-RANSOMWARE-CONTINUITY-001` and `packet_id=DPL-TACTICAL-QUANTUM-PNT-TIME-001` for recommendations that alter launch timelines, warning windows, or force protection postures.

## Domain Toolchain Override (2026-03-11, Cislunar Custody and Strategic NC3 Coupling)

- Add `tool_suite_id=ts-cislunar-sensor-custody-attribution-v1` + `protocol_stack_id=ps-cislunar-sensor-custody-attribution-stack-v1` when launch-window deconfliction recommendations depend on cislunar track custody and anomaly attribution confidence.
- Add `tool_suite_id=ts-strategic-nc3-relocation-emcon-v1` + `protocol_stack_id=ps-strategic-nc3-relocation-emcon-stack-v1` when launch conflict branches affect strategic command-post relocation, EMCON posture, or emergency-message continuity.
- Add `packet_id=DPL-CISLUNAR-CUSTODY-ATTRIB-001` and `packet_id=DPL-NC3-RELOC-EMCON-001` for branches that materially change launch risk acceptance, strategic warning pathways, or authority-gated escalation timing.

## Domain Toolchain Override (2026-03-11, Expansion Wave X Addendum)

- Prioritize `tool_suite_id=ts-joint-commercial-space-ssa-data-fusion-and-tasking-cell-v1` + `protocol_stack_id=ps-joint-commercial-space-ssa-data-fusion-and-tasking-cell-stack-v1` when conjunction risk and launch-window deconfliction require blended commercial-military SSA confidence.
- Add packet bindings `packet_id=DPL-JOINT_SPACE_LAUNCH_WINDOW_CONFLICT_DECONFLICTION_CELL-009` (primary) and `packet_id=DPL-JOINT_SPACE_LAUNCH_WINDOW_CONFLICT_DECONFLICTION_CELL-010` (degraded), with explicit warning-confidence thresholds.
- Require `validation_owner`, `revalidation_utc`, and `ack_chain_status` before releasing any time-critical deconfliction recommendation to operational authorities.

## Domain Toolchain Override (2026-03-11, Expansion Wave XII Addendum)

- Add `tool_suite_id=ts-joint-orbital-servicing-inspection-and-counter-tamper-custody-cell-v1` + `protocol_stack_id=ps-joint-orbital-servicing-inspection-and-counter-tamper-custody-cell-stack-v1` when launch-window recommendations depend on servicing timeline integrity and anti-tamper custody evidence.
- Add `tool_suite_id=ts-strategic-deterrence-signaling-and-messaging-integrity-cell-v1` + `protocol_stack_id=ps-strategic-deterrence-signaling-and-messaging-integrity-cell-stack-v1` when launch conflict deconfliction alters strategic signaling options, warning posture, or escalation messaging.
- Add `packet_id=DPL-ORBITAL-SERVICING-TAMPER-CUSTODY-001` and `packet_id=DPL-DETERRENCE-MESSAGING-INTEGRITY-001` for branches that alter launch timing authority, warning confidence, or strategic communication release controls.
