---
name: joint-sead-and-dead-kill-web-optimizer
description: Optimize suppression and destruction of enemy air defenses for joint strike packages under contested conditions. Use when planning, rehearsing, or updating operations that require synchronized actions across multiple components, staff sections, or coalition partners.
---

# Joint SEAD and DEAD Kill-Web Optimizer

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: mission analysis, commander's intent, assumptions, CCIR, constraints.
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

Primary products for this skill: sead and dead synchronization board, emitter collapse decision matrix, reattack trigger ladder.

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

- Use protocol examples in `../_shared/references/tool-protocol-playbooks.md` to produce operator-ready tool invocation packets.
- Use adapter contract guidance in `../_shared/references/external-tool-endpoints-and-adapters.md` to define endpoint schemas, transport, and fallback behavior.
- Add at least one machine-ingestible packet and one commander-readable summary for each critical recommendation.

## Domain Tool Packet Library

- Use scenario packets in `../_shared/references/domain-tool-packet-library.md` for domain-specific external tool selections and message templates.
- Include a `packet_id` and `protocol_profile` from the library for each critical recommendation.
- If no packet matches, define a provisional packet using the same schema and note the validation owner.

## Domain Data Contract

- Use mapping guidance in `../_shared/references/joint-mission-data-contracts.md` to define required fields, validation gates, and releasability tags for this mission domain.
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

## Domain Toolchain Override (2026-03-08, Runway Magnetic Clearance Expansion)

- Prioritize `tool_suite_id=ts-runway-magnetic-anomaly-clearance-v1` with `protocol_stack_id=ps-runway-magnetic-anomaly-stack-v1` when SEAD/DEAD follow-on sorties are constrained by runway hazard uncertainty.
- Use packet `DPL-RUNWAY-MAG-ANOMALY-001` to bind anomaly confidence, EOD sequencing, and sortie reattack window synchronization.
- If anomaly confidence remains below threshold, downgrade to conservative sortie generation guidance and require air boss and commander concurrence.

## Domain Toolchain Override (2026-03-08, EW Order-Of-Battle Drift Expansion)

- Prioritize `tool_suite_id=ts-ew-order-of-battle-drift-v1` with `protocol_stack_id=ps-ew-ob-drift-stack-v1` when adversary emitter behavior diverges from mission-data baselines.
- Use packet `DPL-EW-OB-DRIFT-001` to bind drift confidence, mission-data retune actions, and reattack timing decisions.
- If mission-data retune cannot be verified in time, publish an advisory-only branch with explicit risk-to-package survivability annotations.

## Domain Toolchain Override (2026-03-08, EOB Decay Forecast Integration)

- Prioritize `tool_suite_id=ts-eob-decay-forecast-v1` with `protocol_stack_id=ps-eob-decay-forecast-stack-v1` when adversary emitter behaviors drift beyond mission-data confidence thresholds.
- Use packet `DPL-EOB-DECAY-FORECAST-001` to connect drift confidence, retune sequencing, and reattack timing decisions.
- If independent RF cross-check data is stale, downgrade to advisory-only and require explicit command review before execution.

## Domain Toolchain Override (2026-03-09, Obscurant Navigation and Sensor Confidence)

- Prioritize `tool_suite_id=ts-lidar-obscurant-navigation-assurance-v1` with `protocol_stack_id=ps-lidar-obscurant-navigation-assurance-stack-v1` when SEAD ingress/egress timing is sensitive to dust, smoke, or obscurant-driven sensor degradation.
- Use packet `DPL-LIDAR-OBSCURANT-NAV-001` to bind sensor confidence gates, timing windows, and fallback navigation branches for strike packages.
- If cross-sensor confidence cannot be sustained, downgrade to constrained-tempo options and require explicit package commander concurrence.

## Domain Toolchain Override (2026-03-09, Spectrum Sensor Deception Attribution)

- Prioritize `tool_suite_id=ts-spectrum-sensor-deception-attribution-v1` with `protocol_stack_id=ps-spectrum-sensor-deception-attribution-stack-v1` when adversary sensor-deception activity degrades emitter confidence for SEAD/DEAD targeting.
- Use packet `DPL-SPECTRUM-SENSOR-DECEPTION-ATTRIBUTION-001` to bind attribution confidence, retask timing, and commander decision checkpoints.
- If independent corroboration or command authority validation fails, downgrade to advisory-only recommendations and require explicit package commander review.

## Domain Toolchain Override (2026-03-09, Precision Navigation Spoofing Adjudication)

- Prioritize `tool_suite_id=ts-precision-navigation-spoofing-adjudication-v1` with `protocol_stack_id=ps-precision-navigation-spoofing-adjudication-stack-v1` when spoofing or timing drift threatens SEAD ingress/egress geometry.
- Use packet `DPL-PRECISION-NAVIGATION-SPOOFING-ADJUDICATION-001` to bind navigation-confidence bands, fallback path timing, and package commander release checkpoints.
- If timing integrity or cross-sensor confidence is incomplete, downgrade to constrained-tempo recommendations and require explicit commander concurrence.

## Domain Toolchain Override (2026-03-09, Chokepoint Interdiction and Repeater Route Protection)

- Prioritize tool_suite_id=ts-subsea-repeater-tamper-restoration-v1 and tool_suite_id=ts-maritime-chokepoint-contraband-interdiction-v1 when kill-web support depends on contested maritime and undersea relay pathways.
- Use packets DPL-SUBSEA-REPEATER-TAMPER-RESTORATION-001 and DPL-MARITIME-CHOKEPOINT-CONTRABAND-INTERDICTION-001 to bind routing continuity, interdiction priorities, and command-approved retask gates.
- If route-custody evidence or legal acknowledgment integrity is incomplete, downgrade to advisory-only retask recommendations until command review is complete.
