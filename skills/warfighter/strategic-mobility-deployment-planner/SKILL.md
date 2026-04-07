---
name: strategic-mobility-deployment-planner
description: Plan strategic mobility and deployment sequencing. Use when phasing personnel/equipment movement under time-phased force deployment constraints.
---

# Strategic Mobility Deployment Planner

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: TPFDD-like requirements, lift assets, port/airfield capacity, diplomatic clearances.
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

Primary products for this skill: deployment sequencing plan, bottleneck mitigation actions, movement readiness status.

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

## Domain Toolchain Override (2026-03-14, Expansion Wave XLII Addendum)

- Add `tool_suite_id=ts-strategic-economic-coercion-logistics-warning-v1` + `protocol_stack_id=ps-strategic-economic-coercion-logistics-warning-stack-v1` when deployment feasibility depends on coercion-driven carrier loss, insurance shock, customs friction, or strategic route pressure.
- Add `tool_suite_id=ts-coalition-allied-depot-sabotage-wargame-v1` + `protocol_stack_id=ps-coalition-allied-depot-sabotage-wargame-stack-v1` when strategic mobility branches depend on depot survivability, protected stock release, or allied rail/port reconstitution timing.
- Add `tool_suite_id=ts-homeland-dam-levee-engineer-surge-v1` + `protocol_stack_id=ps-homeland-dam-levee-engineer-surge-stack-v1` when flood-control failures or engineer-force reallocation could constrict deployment corridors.
- Add `packet_id=DPL-ECON-COERCION-LOGISTICS-001`, `packet_id=DPL-DEPOT-SABOTAGE-WARGAME-001`, and `packet_id=DPL-DAM-LEVEE-ENGINEER-SURGE-001` for recommendations that materially alter strategic lift timing, corridor confidence, or mobilization posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLIV Addendum)

- Add `tool_suite_id=ts-homeland-rail-hazmat-military-priority-deconfliction-v1` + `protocol_stack_id=ps-homeland-rail-hazmat-military-priority-deconfliction-stack-v1` when strategic mobility depends on reconciling military dispatch with hazardous-material rail restrictions and civil emergency traffic.
- Add `tool_suite_id=ts-joint-airbase-arresting-gear-runway-cable-reconstitution-v1` + `protocol_stack_id=ps-joint-airbase-arresting-gear-runway-cable-reconstitution-stack-v1` when deployment tempo depends on rapid airbase recovery, arresting-gear readiness, or runway-end cable availability for sortie regeneration.
- Add `packet_id=DPL-RAIL-HAZMAT-MILPRIORITY-DECONFLICTION-001` and `packet_id=DPL-ARRESTING-GEAR-RUNWAY-CABLE-001` for recommendations that materially alter lift timing, corridor confidence, or deployment posture.

## Domain Toolchain Override (2026-03-14, Expansion Wave XLV Addendum)

- Add `tool_suite_id=ts-joint-civil-reserve-air-fleet-activation-v1` + `protocol_stack_id=ps-joint-civil-reserve-air-fleet-activation-stack-v1` when deployment timelines depend on reserve or commercial airlift closing lift gaps or backfilling delayed sealift.
- Add `tool_suite_id=ts-coalition-host-nation-civil-airlift-clearance-v1` + `protocol_stack_id=ps-coalition-host-nation-civil-airlift-clearance-stack-v1` when strategic mobility depends on allied civil tails, host-nation ramp slots, or diplomatic-clearance speed.
- Add `tool_suite_id=ts-joint-armored-vehicle-running-gear-priority-v1` + `protocol_stack_id=ps-joint-armored-vehicle-running-gear-priority-stack-v1` when armored deployment posture depends on track-pad, roadwheel, or final-drive readiness before onward movement.
- Add `packet_id=DPL-CIVIL-RESERVE-AIR-FLEET-001`, `packet_id=DPL-COALITION-CIVIL-AIRLIFT-CLEARANCE-001`, and `packet_id=DPL-ARMORED-RUNNING-GEAR-001` for recommendations that materially alter strategic lift timing, access confidence, or deployment posture.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXX Addendum)

- Add `toolchain_id=TC-EMAC-259`, `tool_suite_id=ts-homeland-emac-interstate-force-flow-synchronization-v1`, and `protocol_stack_id=ps-homeland-emac-interstate-force-flow-synchronization-stack-v1` when strategic mobility depends on interstate staging, EMAC throughput, or reception-node capacity during homeland support.
- Add `toolchain_id=TC-GOVRFF-260`, `tool_suite_id=ts-homeland-governor-request-for-forces-mission-assignment-v1`, and `protocol_stack_id=ps-homeland-governor-request-for-forces-mission-assignment-stack-v1` when deployment recommendations depend on governor requests, mission-assignment speed, or force-package sourcing clarity.
- Add `toolchain_id=TC-LEMOVE-263`, `tool_suite_id=ts-homeland-law-enforcement-military-movement-deconfliction-v1`, and `protocol_stack_id=ps-homeland-law-enforcement-military-movement-deconfliction-stack-v1` when protected movement depends on domestic road controls, checkpoint legitimacy, or public-safety route release.
- Add `packet_id=DPL-EMAC-FORCE-FLOW-001`, `packet_id=DPL-GOV-RFF-MISSION-ASSIGNMENT-001`, and `packet_id=DPL-LE-MIL-MOVEMENT-DECONFLICT-001` for branches that materially alter lift timing, corridor confidence, or domestic deployment posture.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXXI Addendum)

- Add `toolchain_id=TC-DCO-266`, `tool_suite_id=ts-homeland-dco-fema-region-synchronization-v1`, and `protocol_stack_id=ps-homeland-dco-fema-region-synchronization-stack-v1` when strategic mobility depends on FEMA-region support routing, DCO task sequencing, or federal mission-assignment timing.
- Add `toolchain_id=TC-DEBRIS-269`, `tool_suite_id=ts-homeland-debris-clearance-right-of-way-route-priority-v1`, and `protocol_stack_id=ps-homeland-debris-clearance-right-of-way-route-priority-stack-v1` when route clearance, right-of-way authority, or debris removal governs domestic force-flow tempo.
- Add `toolchain_id=TC-ENERGY-273`, `tool_suite_id=ts-homeland-energy-emergency-fuel-waiver-priority-restoration-v1`, and `protocol_stack_id=ps-homeland-energy-emergency-fuel-waiver-priority-restoration-stack-v1` when mobility posture depends on generator fuel waivers, emergency fuel allocation, or priority restoration of critical movement nodes.
- Add `packet_id=DPL-DCO-FEMA-SYNC-001`, `packet_id=DPL-DEBRIS-ROW-ROUTE-001`, and `packet_id=DPL-ENERGY-FUEL-WAIVER-001` for branches that materially alter corridor timing, route confidence, or domestic deployment posture.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXXII Materialization Addendum)

- Add `toolchain_id=TC-EVAC-242`, `tool_suite_id=ts-theater-evacuation-route-humanitarian-logistics-and-traffic-priority-v1`, and `protocol_stack_id=ps-theater-evacuation-route-humanitarian-logistics-and-traffic-priority-stack-v1` when strategic mobility depends on corridor arbitration between military lift, evacuation traffic, and humanitarian convoys.
- Add `toolchain_id=TC-PERMIT-246`, `tool_suite_id=ts-joint-civil-works-emergency-permitting-and-right-of-entry-v1`, and `protocol_stack_id=ps-joint-civil-works-emergency-permitting-and-right-of-entry-stack-v1` when deployment timing depends on emergency permits, access authority, or rapid engineer site release.
- Add `toolchain_id=TC-ESSENTIAL-247`, `tool_suite_id=ts-theater-essential-services-contractor-strike-and-continuity-v1`, and `protocol_stack_id=ps-theater-essential-services-contractor-strike-and-continuity-stack-v1` when strategic mobility posture depends on contractor-supported fuel, loading, maintenance, or traffic-control services.
- Add `toolchain_id=TC-SCHOOL-248`, `tool_suite_id=ts-homeland-base-school-transport-and-dependent-evacuation-v1`, and `protocol_stack_id=ps-homeland-base-school-transport-and-dependent-evacuation-stack-v1` when domestic force-flow choices affect dependent evacuation lanes, school transport, or installation safehaven staging.
- Add `packet_id=DPL-EVAC-TRAFFIC-PRIORITY-001`, `packet_id=DPL-RIGHT-OF-ENTRY-001`, `packet_id=DPL-ESSENTIAL-SERVICES-CONTINUITY-001`, and `packet_id=DPL-DEPENDENT-EVAC-001` for branches that materially alter corridor timing, movement legitimacy, or domestic deployment posture.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXII Addendum)

- Add `toolchain_id=TC-CORR-276`, `tool_suite_id=ts-homeland-corrections-facility-evacuation-guard-force-relief-v1`, and `protocol_stack_id=ps-homeland-corrections-facility-evacuation-guard-force-relief-stack-v1` when domestic movement posture depends on custody transport, escort-force availability, or receiving-site release.
- Add `toolchain_id=TC-FERRY-278`, `tool_suite_id=ts-homeland-ferry-evacuation-island-resupply-priority-v1`, and `protocol_stack_id=ps-homeland-ferry-evacuation-island-resupply-priority-stack-v1` when force flow or life-sustainment depends on ferry lift, island logistics, or terminal throughput.
- Add `toolchain_id=TC-TRANSIT-281`, `tool_suite_id=ts-homeland-transit-bus-evacuation-staging-driver-continuity-v1`, and `protocol_stack_id=ps-homeland-transit-bus-evacuation-staging-driver-continuity-stack-v1` when evacuation capacity depends on staged bus fleets, driver continuity, or protected route release.
- Add `packet_id=DPL-CORRECTIONS-EVAC-GUARDFORCE-001`, `packet_id=DPL-FERRY-ISLAND-RESUPPLY-001`, and `packet_id=DPL-TRANSIT-BUS-EVAC-DRIVER-001` for branches that materially alter lift timing, route confidence, or domestic movement posture.
