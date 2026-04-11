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

## Domain Toolchain Override (2026-04-11, Expansion Wave XCI Addendum)

- Add `toolchain_id=TC-TSPHL-373`, `tool_suite_id=ts-joint-thrift-savings-plan-loan-hardship-withdrawal-beneficiary-continuity-v1`, and `protocol_stack_id=ps-joint-thrift-savings-plan-loan-hardship-withdrawal-beneficiary-continuity-stack-v1` when family-readiness posture depends on emergency liquidity, beneficiary integrity, or retirement-savings access after household shock.
- Add `toolchain_id=TC-MSTAR-376`, `tool_suite_id=ts-joint-military-star-exchange-credit-essential-purchase-continuity-v1`, and `protocol_stack_id=ps-joint-military-star-exchange-credit-essential-purchase-continuity-stack-v1` when household stability depends on exchange-credit access, essential-purchase continuity, or hardship repayment sequencing.
- Add `packet_id=DPL-TSP-LOAN-HARDSHIP-BENEFICIARY-001` and `packet_id=DPL-MILITARY-STAR-EXCHANGE-CREDIT-001` for branches that materially alter household stability, emergency-purchase resilience, or commander confidence in family-support posture.

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

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXII Addendum)

- Add `toolchain_id=TC-TBHEALTH-327`, `tool_suite_id=ts-joint-telebehavioral-health-burnout-suicide-risk-continuity-v1`, and `protocol_stack_id=ps-joint-telebehavioral-health-burnout-suicide-risk-continuity-stack-v1` when family-readiness posture depends on remote behavioral-health continuity, burnout mitigation, or trusted suicide-risk escalation for servicemembers or dependents.
- Add `toolchain_id=TC-HOMELESS-328`, `tool_suite_id=ts-joint-military-homelessness-prevention-transitional-housing-bridge-v1`, and `protocol_stack_id=ps-joint-military-homelessness-prevention-transitional-housing-bridge-stack-v1` when household displacement, unsafe shelter, or homelessness risk drives retention, attendance, or mobilization concerns.
- Add `toolchain_id=TC-BANKR-329`, `tool_suite_id=ts-joint-bankruptcy-consumer-protection-clearance-financial-distress-v1`, and `protocol_stack_id=ps-joint-bankruptcy-consumer-protection-clearance-financial-distress-stack-v1` when debt distress, bankruptcy pressure, or creditor action threatens family survivability, security clearance, or commander confidence in household stability.
- Add `toolchain_id=TC-DOXX-330`, `tool_suite_id=ts-joint-family-online-harassment-doxxing-protective-escalation-v1`, and `protocol_stack_id=ps-joint-family-online-harassment-doxxing-protective-escalation-stack-v1` when targeted harassment, doxxing, or swatting risk creates a protective-escalation branch for military households.
- Add `toolchain_id=TC-COMPASS-331`, `tool_suite_id=ts-joint-compassionate-reassignment-hardship-discharge-humanitarian-transfer-v1`, and `protocol_stack_id=ps-joint-compassionate-reassignment-hardship-discharge-humanitarian-transfer-stack-v1` when family crisis, caregiving breakdown, or hardship may require compassionate personnel routing beyond ordinary emergency-leave assumptions.
- Add `packet_id=DPL-TELEBEHAVIORAL-BURNOUT-SUICIDE-001`, `packet_id=DPL-HOMELESSNESS-TRANSITIONAL-HOUSING-001`, `packet_id=DPL-BANKRUPTCY-CLEARANCE-DISTRESS-001`, `packet_id=DPL-FAMILY-ONLINE-HARASSMENT-DOXXING-001`, and `packet_id=DPL-COMPASSIONATE-REASSIGNMENT-HARDSHIP-001` for branches that materially alter family-support posture, retention outlook, or command confidence in household stability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXIII Addendum)

- Add `toolchain_id=TC-TAMPHC-332`, `tool_suite_id=ts-joint-transitional-healthcare-tamp-chcbp-pharmacy-bridge-v1`, and `protocol_stack_id=ps-joint-transitional-healthcare-tamp-chcbp-pharmacy-bridge-stack-v1` when household stability depends on preserving medical coverage, specialty-care access, or pharmacy continuity during separation, demobilization, or medical transition.
- Add `toolchain_id=TC-VACARE-333`, `tool_suite_id=ts-joint-va-caregiver-support-program-stipend-training-respite-continuity-v1`, and `protocol_stack_id=ps-joint-va-caregiver-support-program-stipend-training-respite-continuity-stack-v1` when family readiness depends on sustained caregiver support, respite capacity, or stipend continuity for a wounded-warrior household.
- Add `toolchain_id=TC-VREIL-334`, `tool_suite_id=ts-joint-vre-independent-living-adaptive-employment-continuity-v1`, and `protocol_stack_id=ps-joint-vre-independent-living-adaptive-employment-continuity-stack-v1` when recovery-driven income stability or transition confidence depends on vocational rehabilitation, adaptive employment, or independent-living support.
- Add `toolchain_id=TC-SAHAA-335`, `tool_suite_id=ts-joint-specially-adapted-housing-automobile-allowance-home-accessibility-benefit-bridge-v1`, and `protocol_stack_id=ps-joint-specially-adapted-housing-automobile-allowance-home-accessibility-benefit-bridge-stack-v1` when household stability depends on adaptive housing, vehicle-accessibility benefits, or home-modification legitimacy after catastrophic injury.
- Add `toolchain_id=TC-MEDHOLD-336`, `tool_suite_id=ts-joint-convalescent-leave-limited-duty-medical-hold-continuity-v1`, and `protocol_stack_id=ps-joint-convalescent-leave-limited-duty-medical-hold-continuity-stack-v1` when family-support timing depends on lawful convalescent leave, medhold continuity, or limited-duty clarity for recovering servicemembers.
- Add `packet_id=DPL-TRANSITIONAL-HEALTHCARE-TAMP-CHCBP-001`, `packet_id=DPL-VA-CAREGIVER-STIPEND-RESPITE-001`, `packet_id=DPL-VRE-INDEPENDENT-LIVING-001`, `packet_id=DPL-SAH-AUTOMOBILE-HOME-ACCESS-001`, and `packet_id=DPL-CONVALESCENT-LEAVE-MEDHOLD-001` for branches that materially alter family-support posture, retention outlook, or command confidence in wounded-warrior household stability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXV Addendum)

- Add `toolchain_id=TC-PARENTAL-343`, `tool_suite_id=ts-joint-parental-leave-pregnancy-postpartum-profile-duty-modification-continuity-v1`, and `protocol_stack_id=ps-joint-parental-leave-pregnancy-postpartum-profile-duty-modification-continuity-stack-v1` when family-readiness posture depends on lawful parental leave, pregnancy or postpartum profile stability, or safe duty-modification continuity.
- Add `toolchain_id=TC-NEWBORN-344`, `tool_suite_id=ts-joint-newborn-birth-certificate-deers-tricare-travel-document-bridge-v1`, and `protocol_stack_id=ps-joint-newborn-birth-certificate-deers-tricare-travel-document-bridge-stack-v1` when household stability depends on newborn documentation, healthcare enrollment, or dependent travel legitimacy.
- Add `toolchain_id=TC-IGEO-345`, `tool_suite_id=ts-joint-inspector-general-equal-opportunity-reprisal-complaint-safeguard-v1`, and `protocol_stack_id=ps-joint-inspector-general-equal-opportunity-reprisal-complaint-safeguard-stack-v1` when protected reporting, reprisal risk, or command-climate harm changes confidence in household stability or unit trust.
- Add `packet_id=DPL-PARENTAL-LEAVE-PREG-POSTPARTUM-001`, `packet_id=DPL-NEWBORN-DEERS-TRICARE-DOCS-001`, and `packet_id=DPL-IG-EO-REPRISAL-SAFEGUARD-001` for branches that materially alter family-support posture, retention outlook, or command confidence in household stability.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXVI Addendum)

- Add `toolchain_id=TC-NJPSEP-349`, `tool_suite_id=ts-joint-nonjudicial-punishment-letter-of-reprimand-administrative-separation-continuity-v1`, and `protocol_stack_id=ps-joint-nonjudicial-punishment-letter-of-reprimand-administrative-separation-continuity-stack-v1` when family-support posture depends on surviving rebuttal deadlines, counsel access, or adverse-action spillover into household stability.
- Add `toolchain_id=TC-A138-354`, `tool_suite_id=ts-joint-article-138-congressional-casework-record-preservation-escalation-v1`, and `protocol_stack_id=ps-joint-article-138-congressional-casework-record-preservation-escalation-stack-v1` when trusted escalation, congressional casework, or record-preservation failure changes confidence in command support for an affected household.
- Add `packet_id=DPL-NJP-LOR-ADMINSEP-001` and `packet_id=DPL-ARTICLE-138-CONGRESSIONAL-001` for branches that materially alter family-support posture, command-trust, or retention outlook.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXVII Addendum)

- Add `toolchain_id=TC-TAPBRIDGE-334`, `tool_suite_id=ts-joint-transition-assistance-vre-dol-federal-hiring-bridge-v1`, and `protocol_stack_id=ps-joint-transition-assistance-vre-dol-federal-hiring-bridge-stack-v1` when lawful transition timing or employment continuity determines whether household stress becomes a readiness loss.
- Add `toolchain_id=TC-FAMNET-335`, `tool_suite_id=ts-joint-family-readiness-group-ombudsman-key-spouse-communication-v1`, and `protocol_stack_id=ps-joint-family-readiness-group-ombudsman-key-spouse-communication-stack-v1` when family-network trust, volunteer routing, or rumor-control integrity drives household stability.
- Add `toolchain_id=TC-ONESOURCE-336`, `tool_suite_id=ts-joint-military-onesource-nonmedical-counseling-peer-support-v1`, and `protocol_stack_id=ps-joint-military-onesource-nonmedical-counseling-peer-support-stack-v1` when non-medical counseling access or peer-support continuity determines whether strain becomes a retention or attendance problem.
- Add `packet_id=DPL-TAP-VRE-FEDHIRE-001`, `packet_id=DPL-FRG-OMBUDSMAN-KEY-SPOUSE-001`, and `packet_id=DPL-ONESOURCE-PEER-SUPPORT-001` for branches that materially alter family-support posture, command-trust, or household resilience.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXVIII Addendum)

- Add `toolchain_id=TC-TRSRES-356`, `tool_suite_id=ts-reserve-component-tricare-reserve-select-retired-reserve-dental-eligibility-bridge-v1`, and `protocol_stack_id=ps-reserve-component-tricare-reserve-select-retired-reserve-dental-eligibility-bridge-stack-v1` when household stability depends on preserving Reserve family healthcare continuity across activation, demobilization, or gray-area retirement change.
- Add `toolchain_id=TC-EFMPSL-357`, `tool_suite_id=ts-joint-efmp-enrollment-assignment-coordination-school-liaison-continuity-v1`, and `protocol_stack_id=ps-joint-efmp-enrollment-assignment-coordination-school-liaison-continuity-stack-v1` when EFMP assignment screening, command sponsorship, or school support determines whether a special-needs household can sustain readiness.
- Add `toolchain_id=TC-MYCAA-359`, `tool_suite_id=ts-strategic-military-spouse-mycaa-portable-training-career-reentry-v1`, and `protocol_stack_id=ps-strategic-military-spouse-mycaa-portable-training-career-reentry-stack-v1` when spouse training restart or career reentry determines whether household income and retention confidence recover.
- Add `toolchain_id=TC-PMHOUS-360`, `tool_suite_id=ts-joint-privatized-military-housing-tenant-rights-bah-recertification-claims-v1`, and `protocol_stack_id=ps-joint-privatized-military-housing-tenant-rights-bah-recertification-claims-stack-v1` when unsafe housing, BAH recertification friction, or unresolved claims drive family-readiness loss.
- Add `toolchain_id=TC-HUMREAD-361`, `tool_suite_id=ts-joint-command-team-human-readiness-case-conference-escalation-v1`, and `protocol_stack_id=ps-joint-command-team-human-readiness-case-conference-escalation-stack-v1` when fragmented support lanes, privacy-release posture, or unresolved blockers require deliberate command integration.
- Add `packet_id=DPL-TRS-TRR-DENTAL-ELIGIBILITY-001`, `packet_id=DPL-EFMP-ASSIGNMENT-SCHOOL-001`, `packet_id=DPL-MYCAA-TRAINING-CAREER-001`, `packet_id=DPL-PRIVATIZED-HOUSING-BAH-CLAIMS-001`, and `packet_id=DPL-HUMAN-READINESS-CASE-CONFERENCE-001` for branches that materially alter family-support posture, household resilience, or retention confidence.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXIX Addendum)

- Add `toolchain_id=TC-UATOUR-362`, `tool_suite_id=ts-joint-unaccompanied-tour-family-separation-allowance-deferred-travel-continuity-v1`, and `protocol_stack_id=ps-joint-unaccompanied-tour-family-separation-allowance-deferred-travel-continuity-stack-v1` when household stability depends on separated-family legitimacy, unaccompanied-tour order integrity, or deferred-dependent-travel confidence.
- Add `toolchain_id=TC-TAXDOM-363`, `tool_suite_id=ts-joint-state-tax-domicile-residency-withholding-continuity-v1`, and `protocol_stack_id=ps-joint-state-tax-domicile-residency-withholding-continuity-stack-v1` when household resilience depends on resolving state-tax conflict, withholding drift, or legal-residence uncertainty.
- Add `toolchain_id=TC-SCHTRN-364`, `tool_suite_id=ts-joint-military-child-school-transfer-transcript-graduation-continuity-v1`, and `protocol_stack_id=ps-joint-military-child-school-transfer-transcript-graduation-continuity-stack-v1` when school-transfer delay, transcript loss, or graduation-risk pressure threatens family stability.
- Add `toolchain_id=TC-AUTOFIN-365`, `tool_suite_id=ts-joint-consumer-auto-loan-repossession-insurance-gap-transportation-continuity-v1`, and `protocol_stack_id=ps-joint-consumer-auto-loan-repossession-insurance-gap-transportation-continuity-stack-v1` when household transport collapse, repossession exposure, or uninsured movement changes attendance or retention confidence.
- Add `packet_id=DPL-UNACCOMP-FSA-DEFER-001`, `packet_id=DPL-STATE-TAX-DOMICILE-001`, `packet_id=DPL-SCHOOL-TRANSFER-GRAD-001`, and `packet_id=DPL-AUTO-REPO-TRANSPORT-001` for branches that materially alter family-support posture, household resilience, or retention confidence.

## Domain Toolchain Override (2026-04-11, Expansion Wave XC Addendum)

- Add `toolchain_id=TC-MYPAY-366`, `tool_suite_id=ts-joint-mypay-les-allotment-payroll-access-continuity-v1`, and `protocol_stack_id=ps-joint-mypay-les-allotment-payroll-access-continuity-stack-v1` when household resilience depends on restoring payroll access, LES correctness, or allotment continuity.
- Add `toolchain_id=TC-REENLIST-367`, `tool_suite_id=ts-joint-reenlistment-selective-retention-bonus-career-field-reclassification-continuity-v1`, and `protocol_stack_id=ps-joint-reenlistment-selective-retention-bonus-career-field-reclassification-continuity-stack-v1` when reenlistment windows, SRB legitimacy, or reclassification delays materially change family stability or retention confidence.
- Add `toolchain_id=TC-BARRDORM-368`, `tool_suite_id=ts-joint-barracks-dorm-work-order-bah-exception-emergency-relocation-continuity-v1`, and `protocol_stack_id=ps-joint-barracks-dorm-work-order-bah-exception-emergency-relocation-continuity-stack-v1` when unsafe rooms, delayed repairs, or emergency relocation materially change household stability or command confidence in support posture.
- Add `toolchain_id=TC-LEAVE-370`, `tool_suite_id=ts-joint-leave-carryover-special-leave-accrual-sell-back-continuity-v1`, and `protocol_stack_id=ps-joint-leave-carryover-special-leave-accrual-sell-back-continuity-stack-v1` when leave-balance drift, SLA pressure, or sell-back timing materially changes recovery confidence or household planning.
- Add `toolchain_id=TC-PROFILE-371`, `tool_suite_id=ts-joint-duty-limiting-profile-accommodation-nondeployable-code-continuity-v1`, and `protocol_stack_id=ps-joint-duty-limiting-profile-accommodation-nondeployable-code-continuity-stack-v1` when stale profiles, missing accommodations, or wrong nondeployable codes materially change household stability or human-readiness risk.
- Add `packet_id=DPL-MYPAY-LES-ALLOTMENT-001`, `packet_id=DPL-REENLISTMENT-SRB-RECLASS-001`, `packet_id=DPL-BARRACKS-DORM-BAH-RELOCATE-001`, `packet_id=DPL-LEAVE-SLA-SELLBACK-001`, and `packet_id=DPL-PROFILE-NONDEPLOY-CODE-001` for branches that materially alter family-support posture, household resilience, or retention confidence.

## Domain Toolchain Override (2026-04-11, Expansion Wave XCIII Addendum)

- Add `toolchain_id=TC-ARTCARE-384`, `tool_suite_id=ts-joint-assisted-reproductive-care-fertility-preservation-cryostorage-continuity-v1`, and `protocol_stack_id=ps-joint-assisted-reproductive-care-fertility-preservation-cryostorage-continuity-stack-v1` when household stability depends on preserved fertility-treatment timing, cryostorage integrity, or specialty-care authorization continuity.
- Add `toolchain_id=TC-SURRO-385`, `tool_suite_id=ts-joint-surrogacy-parentage-newborn-documentation-dependent-enrollment-continuity-v1`, and `protocol_stack_id=ps-joint-surrogacy-parentage-newborn-documentation-dependent-enrollment-continuity-stack-v1` when family-formation legality, newborn-documentation continuity, or dependent-enrollment delay threatens household stability or retention confidence.
- Add `packet_id=DPL-ART-CRYOSTORAGE-001` and `packet_id=DPL-SURROGACY-PARENTAGE-001` for branches that materially alter family-support posture, household resilience, or command confidence in lawful family continuity.
