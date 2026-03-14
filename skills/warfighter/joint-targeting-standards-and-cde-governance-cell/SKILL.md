---
name: joint-targeting-standards-and-cde-governance-cell
description: Support U.S. warfighter planning and decision support for Joint Targeting Standards And CDE Governance Cell. Use when missions require targeting standards governance, collateral damage estimate workflow assurance, and no-strike/restricted target synchronization, integrated options, and protocol-aware staff outputs.
---

# Joint Targeting Standards and CDE Governance Cell

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

Primary products for this skill: joint targeting standards board package, CDE quality audit, no-strike list synchronization report.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: joint targeting workflow systems, collateral damage estimation analytics, no-strike and restricted-target governance boards.

## Protocol Profile

Preferred protocol families for this skill: USMTF, VMF, Link 16 J-series.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and name the exact tools selected for this mission set.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Prioritize these tools or protocol families for this domain: GCCS-J/JADOCS, AFATDS, ISR collection managers.
- State the protocol or message format for outbound coordination (for example USMTF, VMF, Link 16 J-series).
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
- Focus on standards governance and quality control; do not provide strike package construction, aimpoint optimization, or attack geometry instructions.
- Require no-strike/restricted target reconciliation evidence before releasing any recommendation with projected effects.
- If CDE inputs are stale, incomplete, or disputed, mark recommendations as `provisional`, downgrade to advisory-only, and require command/legal review.

## RF/PNT Adversarial Integrity Checks

- Require explicit RF emitter-identity confidence and blue-force conflict checks before validating target data pipelines.
- Require a cross-domain GPS/PNT anomaly check when timing, track quality, or geolocation trust is degraded.
- If RF identity confidence or PNT trust is below mission threshold, output only a blocked or advisory status with remediation owners and suspense.

## Targeting Governance Authority Gate

- Require command/legal verification tokens for all high-consequence recommendations: `authority_tier`, `legal_review_id`, `no_strike_sync_utc`, `cde_method_version`, and `approval_role`.
- If target identity confidence, CDE method traceability, or no-strike synchronization is not current, output only a blocked status with remediation actions and suspense.
- Never emit content that can be interpreted as target execution direction; keep outputs limited to governance assurance, quality control, and risk communication.

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

## Domain Toolchain Override (2026-03-11, Expansion Wave XI Addendum)

- Prioritize `tool_suite_id=ts-theater-air-defense-emitter-decoy-logistics-cell-v1` + `protocol_stack_id=ps-theater-air-defense-emitter-decoy-logistics-cell-stack-v1` when targeting timelines require synchronized emitter/decoy repositioning and survivability tradeoffs.
- Prioritize `tool_suite_id=ts-joint-space-based-ir-missile-warning-false-track-adjudication-cell-v1` + `protocol_stack_id=ps-joint-space-based-ir-missile-warning-false-track-adjudication-cell-stack-v1` when warning-track confidence may alter target validation or escalation thresholds.
- Add `packet_id=DPL-JOINT_TARGETING_STANDARDS_AND_CDE_GOVERNANCE_CELL-005` and `packet_id=DPL-JOINT_TARGETING_STANDARDS_AND_CDE_GOVERNANCE_CELL-006` for high-consequence release recommendations.

## Domain Toolchain Override (2026-03-12, Expansion Wave XVII Addendum)

- Prioritize `tool_suite_id=ts-joint-long-range-precision-fires-deconfliction-cell-v1` + `protocol_stack_id=ps-joint-long-range-precision-fires-deconfliction-cell-stack-v1` when release timelines require synchronized cross-domain timing, no-strike integrity, and escalation-safe strike sequencing.
- Prioritize `tool_suite_id=ts-joint-electromagnetic-spectrum-superiority-cell-v1` + `protocol_stack_id=ps-joint-electromagnetic-spectrum-superiority-cell-stack-v1` when target confidence depends on jammer/deception adjudication and blue-force electromagnetic fratricide prevention.
- Add `packet_id=DPL-LRPF-DECONFLICTION-001` and `packet_id=DPL-EMSO-SUPERIORITY-001` for high-consequence release recommendations that shift CDE confidence, strike timing, or authority-gate sequencing.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXIII Addendum)

- Add `tool_suite_id=ts-orbital-servicing-refuel-assurance-v1` + `protocol_stack_id=ps-orbital-servicing-refuel-assurance-stack-v1` when recommendations depend on contested space-logistics servicing continuity, custody confidence, or maneuver-safe refuel timing.
- Add `tool_suite_id=ts-denied-terrain-drone-resupply-nav-v1` + `protocol_stack_id=ps-denied-terrain-drone-resupply-nav-stack-v1` when branch viability depends on autonomous resupply route confidence through denied terrain.
- Add `tool_suite_id=ts-coalition-cable-landing-data-sovereignty-v1` + `protocol_stack_id=ps-coalition-cable-landing-data-sovereignty-stack-v1` when recommendations depend on sovereign data routing, coalition caveats, or cable-landing continuity.
- Add `tool_suite_id=ts-runway-ice-fog-autoland-assurance-v1` + `protocol_stack_id=ps-runway-ice-fog-autoland-assurance-stack-v1` when mission tempo is constrained by low-visibility runway conditions and autoland safety confidence.
- Add `packet_id=DPL-ORBITAL-SERVICING-REFUEL-001`, `packet_id=DPL-DENIED-TERRAIN-DRONE-RESUPPLY-001`, `packet_id=DPL-COALITION-CABLE-LANDING-SOVEREIGNTY-001`, and `packet_id=DPL-RUNWAY-ICE-FOG-AUTOLAND-001` for branches that materially alter commander GO/NO-GO posture.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXIV Addendum)

- Add `tool_suite_id=ts-joint-deep-ocean-sosus-reconstitution-decoy-v1` + `protocol_stack_id=ps-joint-deep-ocean-sosus-reconstitution-decoy-stack-v1` when maritime targeting depends on decoy-discriminated undersea cues.
- Add `tool_suite_id=ts-joint-cyber-em-spectrum-mission-reroute-v1` + `protocol_stack_id=ps-joint-cyber-em-spectrum-mission-reroute-stack-v1` when contested data-link conditions affect CDE confidence.
- Add `packet_id=DPL-JOINT-DEEP-OCEAN-SOSUS-001` and `packet_id=DPL-JOINT-CYBER-EM-REROUTE-001` for targeting-approval branches that hinge on external cue validity.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXV Addendum)

- Prioritize `tool_suite_id=ts-joint-cislunar-logistics-interdiction-reconstitution-v1` with `protocol_stack_id=ps-joint-cislunar-logistics-interdiction-reconstitution-stack-v1` when strategic space logistics, custody confidence, or cislunar maneuver assurance directly affect mission risk decisions.
- Add `tool_suite_id=ts-theater-underwater-datacenter-cooling-grid-defense-v1` with `protocol_stack_id=ps-theater-underwater-datacenter-cooling-grid-defense-stack-v1` when mission outcomes depend on underwater compute resilience, cooling continuity, or cyber-physical load restoration.
- Add `packet_id=DPL-CISLUNAR-LOGISTICS-INTERDICTION-001` and `packet_id=DPL-UNDERWATER-DATACENTER-COOLING-DEFENSE-001` for recommendations that alter mission posture, contingency branches, or strategic continuity authorities.


## Domain Toolchain Override (2026-03-12, Expansion Wave XXVI Addendum)

- Add tool_suite_id=ts-theater-contested-pnt-time-mesh-recovery-v1 + protocol_stack_id=ps-theater-contested-pnt-time-mesh-recovery-stack-v1 when targeting confidence depends on denied-PNT time-transfer recovery and fires synchronization integrity.
- Add packet_id=DPL-PNT-TIME-MESH-RECOVERY-001 for branches that alter target-release timing or collateral-risk assumptions.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLII Addendum)

- Add `tool_suite_id=ts-theater-no-strike-geofence-integrity-v1` + `protocol_stack_id=ps-theater-no-strike-geofence-integrity-stack-v1` when dynamic protected-boundary drift could invalidate CDE, no-strike, or restricted-target logic.
- Add `tool_suite_id=ts-joint-tactical-legal-attribution-synthesis-v1` + `protocol_stack_id=ps-joint-tactical-legal-attribution-synthesis-stack-v1` when high-consequence release decisions depend on fast, legally reviewable attribution or evidentiary sufficiency.
- Add `tool_suite_id=ts-joint-command-voice-spoof-defense-v1` + `protocol_stack_id=ps-joint-command-voice-spoof-defense-stack-v1` when target-release authority depends on authenticated voice or media command paths.
- Add `packet_id=DPL-NO-STRIKE-GEOFENCE-001`, `packet_id=DPL-TACTICAL-LEGAL-ATTRIB-001`, and `packet_id=DPL-COMMAND-VOICE-SPOOF-001` for recommendations that materially alter target validity, CDE confidence, or release authority.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIV Addendum)

- Add `tool_suite_id=ts-joint-commercial-sat-imagery-retask-governance-v1` + `protocol_stack_id=ps-joint-commercial-sat-imagery-retask-governance-stack-v1` when targeting confidence depends on governed fallback imagery collection after commercial access denial or sudden reprioritization.
- Add `tool_suite_id=ts-joint-tactical-edge-dataset-provenance-rollback-v1` + `protocol_stack_id=ps-joint-tactical-edge-dataset-provenance-rollback-stack-v1` when CDE, target validation, or machine-assisted mensuration relies on edge datasets that may require trusted rollback.
- Add `packet_id=DPL-COMMERCIAL-SAT-IMAGERY-RETASK-001` and `packet_id=DPL-TACTICAL-EDGE-DATASET-ROLLBACK-001` for recommendations that materially alter target confidence, CDE governance, or release timing.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLV Addendum)

- Add `tool_suite_id=ts-joint-digital-order-watermark-recall-v1` + `protocol_stack_id=ps-joint-digital-order-watermark-recall-stack-v1` when target-release authority, no-strike updates, or restricted-target lists depend on trusted digital order versioning and recall.
- Add `tool_suite_id=ts-theater-mission-sbom-emergency-patch-v1` + `protocol_stack_id=ps-theater-mission-sbom-emergency-patch-stack-v1` when CDE or targeting systems require emergency remediation without losing auditability, rollback control, or mensuration trust.
- Add `packet_id=DPL-DIGITAL-ORDER-WATERMARK-001` and `packet_id=DPL-MISSION-SBOM-EMERGENCY-PATCH-001` for recommendations that materially alter target validity, release authority, or targeting-system trust posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVI Addendum)

- Add `tool_suite_id=ts-joint-ai-order-intent-integrity-v1` + `protocol_stack_id=ps-joint-ai-order-intent-integrity-stack-v1` when AI-generated target tasking, no-strike updates, or restricted-target guidance require intent-fidelity checks before release.
- Add `tool_suite_id=ts-joint-emissions-window-decoy-synchronization-v1` + `protocol_stack_id=ps-joint-emissions-window-decoy-synchronization-stack-v1` when target-release timing depends on synchronized emissions windows, decoy activation, or adversary collection shaping.
- Add `tool_suite_id=ts-theater-battlefield-cloud-federation-admission-control-v1` + `protocol_stack_id=ps-theater-battlefield-cloud-federation-admission-control-stack-v1` when targeting services, mensuration pipelines, or CDE tools must fail over into alternate cloud enclaves without losing trust.
- Add `packet_id=DPL-AI-ORDER-INTENT-001`, `packet_id=DPL-EMISSIONS-DECOY-WINDOW-001`, and `packet_id=DPL-BATTLEFIELD-CLOUD-ADMISSION-001` for recommendations that materially alter target validity, release timing, or targeting-system trust posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLVII Addendum)

- Add `tool_suite_id=ts-joint-laser-designator-sensor-fratricide-prevention-v1` + `protocol_stack_id=ps-joint-laser-designator-sensor-fratricide-prevention-stack-v1` when target validity or fires timing depends on trusted laser-code ownership and sensor-safe cueing.
- Add `tool_suite_id=ts-theater-cloud-credential-burn-access-reconstitution-v1` + `protocol_stack_id=ps-theater-cloud-credential-burn-access-reconstitution-stack-v1` when targeting identity, federation, or service access compromise threatens CDE or release workflows.
- Add `packet_id=DPL-LASER-DESIGNATOR-FRATRICIDE-001` and `packet_id=DPL-CLOUD-CREDENTIAL-BURN-001` for recommendations that materially alter target validity, CDE governance, or release-authority confidence.
