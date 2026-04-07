---
name: civil-defense-mass-evacuation-shelter-cell
description: Support U.S. warfighter planning and decision support for Civil Defense Mass Evacuation Shelter Cell. Use when missions require civil-defense-mass-evacuation-shelter-cell planning, integrated options, and protocol-aware staff outputs.
---

# Civil Defense Mass Evacuation Shelter Cell

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

Primary products for this skill: mass-evacuation sequence plan, shelter load balancing brief, life-safety decision trigger table.

## External Tools and Protocol Integration

- Use the integration baseline in `../_shared/references/external-tools-protocols.md` and name the exact tools selected for this mission set.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Prioritize these tools or protocol families for this domain: emergency operations dashboards, transportation evacuation tools, shelter capacity systems.
- State the protocol or message format for outbound coordination (for example USMTF, API/JSON, STIX/TAXII).
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

## Domain Toolchain Override (2026-03-15, Expansion Wave LXII Addendum)

- Add `tool_suite_id=ts-homeland-rail-evacuation-signaling-restoration-v1` + `protocol_stack_id=ps-homeland-rail-evacuation-signaling-restoration-stack-v1` when evacuation throughput, shelter backpressure, or military-priority movement depends on damaged rail dispatch and signaling recovery.
- Add `tool_suite_id=ts-coalition-refugee-camp-energy-water-cyber-harmonization-v1` + `protocol_stack_id=ps-coalition-refugee-camp-energy-water-cyber-harmonization-stack-v1` when shelter viability depends on lifeline restoration, cyber containment, or displaced-person site stability.
- Add `packet_id=DPL-RAIL-EVAC-SIGNAL-001` and `packet_id=DPL-REFUGEE-CAMP-EW-CYBER-001` for recommendations that materially alter evacuation timing, shelter release, or life-safety risk posture.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXXI Addendum)

- Add `toolchain_id=TC-MASSCARE-268`, `tool_suite_id=ts-homeland-mass-care-access-functional-needs-support-v1`, and `protocol_stack_id=ps-homeland-mass-care-access-functional-needs-support-stack-v1` when shelter operations depend on AFN support, caregiver continuity, accessible transport, or DME and oxygen sustainment.
- Add `toolchain_id=TC-DEBRIS-269`, `tool_suite_id=ts-homeland-debris-clearance-right-of-way-route-priority-v1`, and `protocol_stack_id=ps-homeland-debris-clearance-right-of-way-route-priority-stack-v1` when evacuation tempo or shelter resupply depends on debris removal, corridor release, or right-of-way approval.
- Add `toolchain_id=TC-HOSPDIV-271`, `tool_suite_id=ts-homeland-hospital-diversion-ambulance-va-dod-bed-bridge-v1`, and `protocol_stack_id=ps-homeland-hospital-diversion-ambulance-va-dod-bed-bridge-stack-v1` when shelter medical overflow or ambulance destination confidence affects population-protection recommendations.
- Add `toolchain_id=TC-WATERCOM-272`, `tool_suite_id=ts-homeland-boil-water-food-safety-commodities-distribution-v1`, and `protocol_stack_id=ps-homeland-boil-water-food-safety-commodities-distribution-stack-v1` when shelter viability depends on potable-water status, food-safety controls, or POD sequencing.
- Add `toolchain_id=TC-FATALITY-270`, `tool_suite_id=ts-homeland-fatality-management-morgue-family-assistance-v1`, and `protocol_stack_id=ps-homeland-fatality-management-morgue-family-assistance-stack-v1` when mass-casualty shelter operations require dignified decedent flow, family-assistance-center linkage, or morgue-capacity awareness.
- Add `packet_id=DPL-MASS-CARE-AFN-001`, `packet_id=DPL-DEBRIS-ROW-ROUTE-001`, `packet_id=DPL-HOSPITAL-DIVERSION-VA-DOD-001`, `packet_id=DPL-BOIL-WATER-COMMODITIES-001`, and `packet_id=DPL-FATALITY-MORGUE-FAC-001` for branches that materially alter shelter release, evacuation timing, or life-safety posture.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXII Addendum)

- Add `toolchain_id=TC-MCM-275`, `tool_suite_id=ts-homeland-medical-countermeasure-pod-security-cold-chain-v1`, and `protocol_stack_id=ps-homeland-medical-countermeasure-pod-security-cold-chain-stack-v1` when shelter or evacuation recommendations depend on POD proximity, secure countermeasure distribution, or refrigerated medicine continuity.
- Add `toolchain_id=TC-COOL-277`, `tool_suite_id=ts-homeland-cooling-center-load-shedding-generator-priority-v1`, and `protocol_stack_id=ps-homeland-cooling-center-load-shedding-generator-priority-stack-v1` when shelter viability depends on heat mitigation, generator uptime, or load-shed prioritization.
- Add `toolchain_id=TC-FERRY-278`, `tool_suite_id=ts-homeland-ferry-evacuation-island-resupply-priority-v1`, and `protocol_stack_id=ps-homeland-ferry-evacuation-island-resupply-priority-stack-v1` when mass-care or evacuation throughput depends on ferry embarkation, island shelter relief, or terminal sequencing.
- Add `toolchain_id=TC-TRANSIT-281`, `tool_suite_id=ts-homeland-transit-bus-evacuation-staging-driver-continuity-v1`, and `protocol_stack_id=ps-homeland-transit-bus-evacuation-staging-driver-continuity-stack-v1` when population movement depends on bus staging, driver continuity, or protected pickup-route release.
- Add `packet_id=DPL-MCM-POD-COLDCHAIN-001`, `packet_id=DPL-COOLING-CENTER-GENERATOR-001`, `packet_id=DPL-FERRY-ISLAND-RESUPPLY-001`, and `packet_id=DPL-TRANSIT-BUS-EVAC-DRIVER-001` for branches that materially alter shelter release timing, evacuation posture, or life-safety capacity.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXIII Addendum)

- Add `toolchain_id=TC-PROTECT-283`, `tool_suite_id=ts-homeland-protective-order-domestic-violence-safe-housing-continuity-v1`, and `protocol_stack_id=ps-homeland-protective-order-domestic-violence-safe-housing-continuity-stack-v1` when shelter operations depend on victim separation, protected-location secrecy, or safe-housing diversion.
- Add `toolchain_id=TC-POSTPARTUM-284`, `tool_suite_id=ts-homeland-postpartum-lactation-infant-formula-diaper-continuity-v1`, and `protocol_stack_id=ps-homeland-postpartum-lactation-infant-formula-diaper-continuity-stack-v1` when shelter viability depends on maternal-infant privacy, lactation support, or formula and diaper sustainment.
- Add `toolchain_id=TC-COSHELTER-285`, `tool_suite_id=ts-homeland-base-pet-service-animal-family-co-shelter-v1`, and `protocol_stack_id=ps-homeland-base-pet-service-animal-family-co-shelter-stack-v1` when evacuation compliance or shelter occupancy depends on pet and service-animal co-shelter support.
- Add `toolchain_id=TC-FOODBRIDGE-286`, `tool_suite_id=ts-homeland-commissary-exchange-food-bank-school-meal-bridging-v1`, and `protocol_stack_id=ps-homeland-commissary-exchange-food-bank-school-meal-bridging-stack-v1` when shelter sustainment depends on emergency family food access, school-meal substitution, or commissary bridging.
- Add `packet_id=DPL-PROTECTIVE-ORDER-SAFE-HOUSING-001`, `packet_id=DPL-POSTPARTUM-LACTATION-FORMULA-001`, `packet_id=DPL-PET-SERVICE-ANIMAL-COSHELTER-001`, and `packet_id=DPL-COMMISSARY-FOOD-BRIDGE-001` for branches that materially alter shelter occupancy, evacuation timing, or family life-safety posture.
