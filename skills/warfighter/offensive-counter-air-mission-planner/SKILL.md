---
name: offensive-counter-air-mission-planner
description: Build offensive counter-air plans to suppress or destroy adversary air capabilities. Use when sequencing OCA sweeps, escorts, and strike support under contested air defense.
---

# Offensive Counter Air Mission Planner

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: enemy IADS layout, sortie availability, tanker support, desired effects.
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

Primary products for this skill: OCA sortie plan, threat suppression phasing, escort allocation matrix.

## U.S. Warfighter Employment Notes

- Prioritize USAF, USN, and USMC datalink/common operational picture interoperability assumptions in every COA.
- Include tanker and FARP fragility branches so sortie generation risk is explicit under anti-access pressure.
- Add minimum kill-chain timing and data-freshness thresholds before recommending any high-tempo option.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and name the exact tools selected for this mission set.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Prioritize these tools or protocol families for this domain: TBMCS and JADOCS, VMF, Link 16 J-series.
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
- Provide decision-support framing only; do not generate platform-specific weapon employment instructions, weaponeering parameters, or target-coordinate execution packets.
- Require explicit human command approval (`requires_human_approval: true`) before any recommendation that could change engagement posture or escalation risk.
- Include a civilian-risk mitigation note and no-strike validation status for each high-consequence recommendation.

## Escalation and Release Control

- For each recommendation with potential kinetic or escalation impact, include: `authority_tier`, `approval_role`, `approval_timestamp_utc`, `roe_reference`, and `audit_record_id`.
- If tanker support, IFF confidence, airspace deconfliction, or legal/ROE status is stale, conflicting, or unavailable, force `advisory_only: true` and generate a constrained branch with required validation tasks.
- Restrict outputs to planning-level COA comparison and risk controls; do not provide launch/attack sequencing directives.

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
- For tanker and strategic mobility disruptions affecting OCA package persistence, prioritize `ts-contested-tanker-airbridge-v1` with `ps-contested-tanker-airbridge-stack-v1`.
- For emergency civil-military air corridor closures during swarm pressure, include `ts-swarmsafe-air-corridor-v1` with `ps-swarmsafe-air-corridor-stack-v1`.
- For degraded navigation transitions in navwar conditions, include `ts-pnt-transition-terrain-nav-v1` with `ps-pnt-transition-terrain-nav-stack-v1`.
- For polar and high-latitude SATCOM blackout contingencies affecting command links, include `ts-polar-satcom-reversion-v1` with `ps-polar-satcom-reversion-stack-v1`.
- For ISR persistence loss from aerostat disruption and EW pressure, include `ts-aerostat-isr-resilience-v1` with `ps-aerostat-isr-resilience-stack-v1`.
- For offshore energy platform defense dependencies that affect maritime OCA staging, include `ts-offshore-energy-platform-defense-v1` with `ps-offshore-energy-platform-defense-stack-v1`.
- For joint PNT denial requiring theater-wide fallback, include `ts-astroinertial-reversion-v1` with `ps-astroinertial-reversion-stack-v1`.
- For contested EOB freshness and emitter-ID drift that affects suppression planning, include `ts-eob-drift-detection-v1` with `ps-eob-drift-detection-stack-v1`.
- For disconnected strike-assessment imagery prioritization, include `ts-disconnected-uas-bda-triage-v1` with `ps-disconnected-uas-bda-triage-stack-v1`.
- For austere airfield sortie risk from wildlife surges, include `ts-forward-airstrip-bird-strike-suppression-v1` with `ps-forward-airstrip-bird-strike-suppression-stack-v1`.
- For severe bandwidth limits impacting ISR video feeds, include `ts-spectrum-frugal-video-prioritization-v1` with `ps-spectrum-frugal-video-prioritization-stack-v1`.
- For cellular priority-service restoration that affects civil-military airbase coordination, include `ts-cellular-priority-service-restoration-v1` with `ps-cellular-priority-service-restoration-stack-v1`.
- For strategic engine scarcity that constrains sortie generation, include `ts-aviation-engine-allocation-sanctions-v1` with `ps-aviation-engine-allocation-sanctions-stack-v1`.
- For expeditionary microgrid restart options using ammonia conversion at airbases, include `ts-microgrid-ammonia-blackstart-v1` with `ps-microgrid-ammonia-blackstart-stack-v1`.
- For disrupted national-security launch cadence affecting air-space integration windows, include `ts-contested-space-launch-reconstitution-v1` with `ps-contested-space-launch-reconstitution-stack-v1`.
- For contested polar communications recovery paths supporting long-range OCA coordination, include `ts-under-ice-cable-break-repair-priority-v1` with `ps-under-ice-cable-break-repair-priority-stack-v1`.
- For Arctic SAR support demands competing for OCA support sorties, include `ts-arctic-sar-satcom-degraded-v1` with `ps-arctic-sar-satcom-degraded-stack-v1`.
- For electromagnetic launch-system power deconfliction impacts in theater fires planning, include `ts-railgun-power-budget-v1` with `ps-railgun-power-budget-stack-v1`.
- For civil air traffic conflict when adversaries spoof navigation signals, include `ts-civil-air-gps-spoof-deconfliction-v1` with `ps-civil-air-gps-spoof-deconfliction-stack-v1`.
- For additive-manufactured UAS component release decisions affecting escort and ISR packages, include `ts-additive-drone-airworthiness-inspection-v1` with `ps-additive-drone-airworthiness-inspection-stack-v1`.
- For homeland SATCOM ground-station blackout impacts on long-range command-and-control links, include `ts-satcom-ground-blackout-restoration-v1` with `ps-satcom-ground-blackout-restoration-stack-v1`.
- For austere runway sortie recovery after FOD and drone-debris events, include `ts-austere-runway-fod-drone-debris-v1` with `ps-austere-runway-fod-drone-debris-stack-v1`.
- For rapid runway recertification under sustained sortie pressure, include `ts-expeditionary-runway-rapid-certification-v1` with `ps-expeditionary-runway-rapid-certification-stack-v1`.
- For denied weather-radar conditions affecting launch and recovery risk, include `ts-denied-weather-radar-gap-fusion-v1` with `ps-denied-weather-radar-gap-fusion-stack-v1`.
- For multi-sensor nowcast fallback when primary weather coverage is degraded, include `ts-multi-sensor-nowcast-fallback-v1` with `ps-multi-sensor-nowcast-fallback-stack-v1`.
- For military GPS ground-segment disruption impacts on OCA mission timing, include `ts-gps-ground-segment-restoration-v1` with `ps-gps-ground-segment-restoration-stack-v1`.
- For rail-air-defense crossing prioritization that protects munitions and sortie support corridors, include `ts-rail-air-defense-crossing-priority-v1` with `ps-rail-air-defense-crossing-priority-stack-v1`.
- For cislunar launch support dependencies affecting global strike posture, include `ts-cislunar-logistics-spaceport-defense-v1` with `ps-cislunar-logistics-spaceport-defense-stack-v1`.


## Domain Toolchain Override (2026-03-12, Expansion Wave XVI Addendum)

- Add tool_suite_id=ts-joint-cislunar-logistics-and-space-lane-contestation-cell-v1 + protocol_stack_id=ps-joint-cislunar-logistics-and-space-lane-contestation-cell-stack-v1 when OCA branch viability depends on contested launch-resupply lanes and orbital sustainment confidence.
- Add tool_suite_id=ts-joint-gray-zone-commercial-fleet-shadowing-attribution-cell-v1 + protocol_stack_id=ps-joint-gray-zone-commercial-fleet-shadowing-attribution-cell-stack-v1 when maritime gray-zone coercion affects carrier support routing, escalation control, or legal attribution timelines.
- Add packet_id=DPL-CISLUNAR-LOGISTICS-CONTEST-001 and packet_id=DPL-GRAYZONE-FLEET-SHADOWING-001 for branches that materially change sortie persistence, escalation posture, or command release assumptions.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXIII Addendum)

- Add `tool_suite_id=ts-orbital-servicing-refuel-assurance-v1` + `protocol_stack_id=ps-orbital-servicing-refuel-assurance-stack-v1` when recommendations depend on contested space-logistics servicing continuity, custody confidence, or maneuver-safe refuel timing.
- Add `tool_suite_id=ts-denied-terrain-drone-resupply-nav-v1` + `protocol_stack_id=ps-denied-terrain-drone-resupply-nav-stack-v1` when branch viability depends on autonomous resupply route confidence through denied terrain.
- Add `tool_suite_id=ts-coalition-cable-landing-data-sovereignty-v1` + `protocol_stack_id=ps-coalition-cable-landing-data-sovereignty-stack-v1` when recommendations depend on sovereign data routing, coalition caveats, or cable-landing continuity.
- Add `tool_suite_id=ts-runway-ice-fog-autoland-assurance-v1` + `protocol_stack_id=ps-runway-ice-fog-autoland-assurance-stack-v1` when mission tempo is constrained by low-visibility runway conditions and autoland safety confidence.
- Add `packet_id=DPL-ORBITAL-SERVICING-REFUEL-001`, `packet_id=DPL-DENIED-TERRAIN-DRONE-RESUPPLY-001`, `packet_id=DPL-COALITION-CABLE-LANDING-SOVEREIGNTY-001`, and `packet_id=DPL-RUNWAY-ICE-FOG-AUTOLAND-001` for branches that materially alter commander GO/NO-GO posture.
