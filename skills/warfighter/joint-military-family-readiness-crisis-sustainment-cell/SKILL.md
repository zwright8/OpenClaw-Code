---
name: joint-military-family-readiness-crisis-sustainment-cell
description: Support military family readiness during prolonged crises that impact force availability. Use when deployment tempo, infrastructure disruption, or benefit-service outages degrade warfighter household stability.
---

# Joint Military Family Readiness Crisis Sustainment Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using these core inputs: unit deployment stressors, family-support service status, housing/utilities disruptions, medical/childcare constraints, reserve-component mobilization data.
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

Primary products for this skill: family-readiness risk dashboard, sustainment support prioritization plan, retention-impact mitigation branches.

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

## Domain Toolchain Override (2026-03-11, High-Priority Domain Expansion)

- Add `tool_suite_id=ts-military-family-readiness-crisis-sustainment-v1` + `protocol_stack_id=ps-military-family-readiness-crisis-sustainment-stack-v1` when this domain is mission-critical in current planning.
- Add `packet_id=DPL-MILITARY-FAMILY-READINESS-CRISIS-001` for branches that can materially alter mission posture or civil-protection outcomes.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXXIII Addendum)

- Add `toolchain_id=TC-SPOUSELIC-282`, `tool_suite_id=ts-joint-military-spouse-license-portability-employment-continuity-v1`, and `protocol_stack_id=ps-joint-military-spouse-license-portability-employment-continuity-stack-v1` when family-readiness posture depends on spouse employment continuity, license reciprocity, or household income stabilization.
- Add `toolchain_id=TC-COMEX-284`, `tool_suite_id=ts-joint-commissary-exchange-subsistence-hygiene-restoration-v1`, and `protocol_stack_id=ps-joint-commissary-exchange-subsistence-hygiene-restoration-stack-v1` when family stability depends on reliable access to essential food, hygiene, and daily-use items during prolonged disruption.
- Add `toolchain_id=TC-BPHARM-286`, `tool_suite_id=ts-joint-base-pharmacy-refill-tricare-coldchain-v1`, and `protocol_stack_id=ps-joint-base-pharmacy-refill-tricare-coldchain-stack-v1` when family-readiness recommendations depend on medication continuity, refill access, or cold-chain-protected treatments.
- Add `toolchain_id=TC-ANIMAL-288`, `tool_suite_id=ts-joint-service-animal-family-pet-evacuation-shelter-v1`, and `protocol_stack_id=ps-joint-service-animal-family-pet-evacuation-shelter-stack-v1` when crisis sustainment depends on evacuation compliance, animal accommodation, or family reunification stability.
- Add `packet_id=DPL-SPOUSE-LICENSE-EMPLOYMENT-001`, `packet_id=DPL-COMMISSARY-EXCHANGE-HYGIENE-001`, `packet_id=DPL-BASE-PHARMACY-TRICARE-COLDCHAIN-001`, and `packet_id=DPL-SERVICE-ANIMAL-PET-EVAC-001` for branches that materially alter family-support posture, retention outlook, or protected-population stability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXIV Addendum)

- Add `toolchain_id=TC-YOUTHBH-292`, `tool_suite_id=ts-strategic-military-child-youth-behavioral-health-school-reintegration-v1`, and `protocol_stack_id=ps-strategic-military-child-youth-behavioral-health-school-reintegration-stack-v1` when family-readiness posture depends on child or youth behavioral-health stabilization, school reintegration, or caregiver support continuity.
- Add `packet_id=DPL-CHILD-YOUTH-BEHAVIORAL-SCHOOL-001` for branches that materially alter retention risk, dependent stability, or senior-leader confidence in household recovery.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXV Addendum)

- Add `toolchain_id=TC-ARCMSG-295`, `tool_suite_id=ts-joint-emergency-leave-american-red-cross-message-command-approval-v1`, and `protocol_stack_id=ps-joint-emergency-leave-american-red-cross-message-command-approval-stack-v1` when family-readiness posture depends on verified emergency leave, compassionate travel, or trusted family-emergency message provenance.
- Add `toolchain_id=TC-EFMP-296`, `tool_suite_id=ts-joint-efmp-respite-medical-device-power-continuity-v1`, and `protocol_stack_id=ps-joint-efmp-respite-medical-device-power-continuity-stack-v1` when household stability depends on EFMP support, power-dependent medical devices, or respite continuity.
- Add `toolchain_id=TC-PCSMOVE-298`, `tool_suite_id=ts-joint-pcs-claims-travel-voucher-temporary-lodging-continuity-v1`, and `protocol_stack_id=ps-joint-pcs-claims-travel-voucher-temporary-lodging-continuity-stack-v1` when family readiness depends on PCS reimbursement stability, travel-voucher recovery, or temporary lodging access.
- Add `toolchain_id=TC-TRICARE-299`, `tool_suite_id=ts-joint-tricare-referral-specialty-care-pharmacy-authorization-bridge-v1`, and `protocol_stack_id=ps-joint-tricare-referral-specialty-care-pharmacy-authorization-bridge-stack-v1` when family-support recommendations depend on specialty-care referrals, pharmacy authorization continuity, or protected medical access.
- Add `toolchain_id=TC-RELIEF-300`, `tool_suite_id=ts-joint-relief-society-hardship-grant-zero-interest-loan-bridge-v1`, and `protocol_stack_id=ps-joint-relief-society-hardship-grant-zero-interest-loan-bridge-stack-v1` when household stabilization depends on hardship grants, zero-interest loans, or command-endorsed emergency assistance.
- Add `packet_id=DPL-EMERGENCY-LEAVE-ARC-001`, `packet_id=DPL-EFMP-RESPITE-POWER-001`, `packet_id=DPL-PCS-CLAIMS-LODGING-001`, `packet_id=DPL-TRICARE-REFERRAL-SPECIALTY-001`, and `packet_id=DPL-RELIEF-SOCIETY-HARDSHIP-001` for branches that materially alter family-support posture, retention outlook, or household survivability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVI Addendum)

- Add `toolchain_id=TC-EDBEN-301`, `tool_suite_id=ts-joint-education-benefits-gi-bill-tuition-assistance-testing-continuity-v1`, and `protocol_stack_id=ps-joint-education-benefits-gi-bill-tuition-assistance-testing-continuity-stack-v1` when family-readiness posture depends on GI Bill, tuition-assistance, credentialing, or testing continuity that shapes retention and transition confidence.
- Add `toolchain_id=TC-FVAP-305`, `tool_suite_id=ts-joint-fvap-overseas-ballot-election-material-continuity-v1`, and `protocol_stack_id=ps-joint-fvap-overseas-ballot-election-material-continuity-stack-v1` when household stability or trust depends on absentee-ballot continuity, election-mail recovery, or lawful voting access during disruption.
- Add `toolchain_id=TC-CREDIT-306`, `tool_suite_id=ts-joint-credit-identity-theft-financial-readiness-recovery-v1`, and `protocol_stack_id=ps-joint-credit-identity-theft-financial-readiness-recovery-stack-v1` when household survivability depends on identity-theft response, credit recovery, or fraud-driven emergency-assistance access.
- Add `packet_id=DPL-ED-BENEFITS-GIBILL-001`, `packet_id=DPL-FVAP-BALLOT-CONTINUITY-001`, and `packet_id=DPL-CREDIT-IDENTITY-RECOVERY-001` for branches that materially alter retention outlook, household stability, or commander confidence in family-support posture.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVII Addendum)

- Add `toolchain_id=TC-DEERS-307`, `tool_suite_id=ts-joint-deers-id-card-eligibility-reconciliation-v1`, and `protocol_stack_id=ps-joint-deers-id-card-eligibility-reconciliation-stack-v1` when family-readiness posture depends on restored sponsor-dependent eligibility, ID-card validity, or entitlement access.
- Add `toolchain_id=TC-IEP504-310`, `tool_suite_id=ts-joint-special-education-iep-504-early-intervention-continuity-v1`, and `protocol_stack_id=ps-joint-special-education-iep-504-early-intervention-continuity-stack-v1` when household stability depends on special-education continuity, early-intervention access, or school-support legitimacy.
- Add `toolchain_id=TC-FAMCARE-314`, `tool_suite_id=ts-joint-family-care-plan-child-support-allotment-court-order-continuity-v1`, and `protocol_stack_id=ps-joint-family-care-plan-child-support-allotment-court-order-continuity-stack-v1` when family-support recommendations depend on valid care plans, support obligations, or court-order continuity.
- Add `packet_id=DPL-DEERS-ID-ELIGIBILITY-001`, `packet_id=DPL-IEP-504-EARLY-INTERVENTION-001`, and `packet_id=DPL-FAMILY-CARE-ALLOTMENT-001` for branches that materially alter family-support posture, retention outlook, or commander confidence in household stability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVIII Addendum)

- Add `toolchain_id=TC-DD93BEN-315`, `tool_suite_id=ts-joint-dd93-sgli-tsgli-beneficiary-estate-readiness-continuity-v1`, and `protocol_stack_id=ps-joint-dd93-sgli-tsgli-beneficiary-estate-readiness-continuity-stack-v1` when household trust or casualty-readiness posture depends on current DD93 data, beneficiary intent, or emergency-contact and estate-document continuity.
- Add `toolchain_id=TC-SKILLBRIDGE-316`, `tool_suite_id=ts-joint-skillbridge-career-skills-apprenticeship-employer-fellowship-continuity-v1`, and `protocol_stack_id=ps-joint-skillbridge-career-skills-apprenticeship-employer-fellowship-continuity-stack-v1` when family stability depends on a clean SkillBridge or employer-fellowship transition for a separating, retiring, or medically recovering warfighter.
- Add `toolchain_id=TC-VAHOME-317`, `tool_suite_id=ts-joint-va-home-loan-guaranty-foreclosure-avoidance-housing-stability-v1`, and `protocol_stack_id=ps-joint-va-home-loan-guaranty-foreclosure-avoidance-housing-stability-stack-v1` when family-readiness recommendations depend on preventing mortgage delinquency, failed closings, or housing loss during PCS, mobilization, or transition.
- Add `packet_id=DPL-DD93-SGLI-TSGLI-ESTATE-001`, `packet_id=DPL-SKILLBRIDGE-CSP-001`, and `packet_id=DPL-VA-HOME-LOAN-HOUSING-001` for branches that materially alter family-support posture, retention outlook, or command confidence in household stability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXI Addendum)

- Add `toolchain_id=TC-CMDSP-323`, `tool_suite_id=ts-joint-command-sponsorship-overseas-screening-no-fee-passport-continuity-v1`, and `protocol_stack_id=ps-joint-command-sponsorship-overseas-screening-no-fee-passport-continuity-stack-v1` when family-readiness posture depends on command sponsorship, overseas screening, no-fee passport continuity, or lawful dependent movement.
- Add `toolchain_id=TC-POV-324`, `tool_suite_id=ts-joint-pov-shipment-driver-license-registration-continuity-v1`, and `protocol_stack_id=ps-joint-pov-shipment-driver-license-registration-continuity-stack-v1` when household stability depends on POV shipment recovery, lawful driving access, or vehicle-registration continuity.
- Add `toolchain_id=TC-CDCFEE-325`, `tool_suite_id=ts-joint-child-development-center-fee-assistance-duty-shift-continuity-v1`, and `protocol_stack_id=ps-joint-child-development-center-fee-assistance-duty-shift-continuity-stack-v1` when family-support recommendations depend on childcare placement, fee assistance, or duty-shift caregiver coverage.
- Add `toolchain_id=TC-STULOAN-326`, `tool_suite_id=ts-joint-federal-student-loan-deferment-fafsa-college-reentry-continuity-v1`, and `protocol_stack_id=ps-joint-federal-student-loan-deferment-fafsa-college-reentry-continuity-stack-v1` when household resilience depends on student-loan protections, FAFSA continuity, or college reentry timing for warfighters or dependents.
- Add `packet_id=DPL-CMD-SPONSOR-OVERSEAS-SCREEN-001`, `packet_id=DPL-POV-SHIPMENT-LICENSE-REG-001`, `packet_id=DPL-CDC-FEE-SHIFT-CONTINUITY-001`, and `packet_id=DPL-STUDENT-LOAN-FAFSA-REENTRY-001` for branches that materially alter family-support posture, retention outlook, or command confidence in household stability.
