---
name: reserve-guard-mobilization-planner
description: Support Reserve Component and National Guard mobilization planning, force sourcing, and integration into joint force flow. Use when scaling force packages for contingencies.
---

# Reserve and Guard Mobilization Planner

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem using domain-specific inputs and command objectives.
2. Identify assumptions, decision thresholds, and what reporting would invalidate the current plan.
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

Primary products for this skill: mobilization timeline, force sourcing decision matrix, integration and readiness tracker.

## External Tools and Protocol Integration

- Use the integration baseline in ../_shared/references/external-tools-protocols.md and name the exact tools selected for this mission set.
- Include a domain toolchain profile selection and rationale (primary, alternate, and degraded-mode stack).
- Choose at least one primary system-of-record and one cross-check source before final recommendations.
- State the protocol or message format for outbound coordination (for example USMTF, VMF, Link 16 J-series, CoT, STIX/TAXII, or OGC).
- Include provenance metadata in outputs: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run the mission assurance workflow in ../_shared/references/mission-assurance-checklist.md before final release.
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

## Domain Toolchain Override (2026-04-06, Expansion Wave LXX Addendum)

- Add `toolchain_id=TC-DSC-258`, `tool_suite_id=ts-homeland-dual-status-command-authority-integration-v1`, and `protocol_stack_id=ps-homeland-dual-status-command-authority-integration-stack-v1` when mobilization planning depends on dual-status command, Title 10 versus Title 32 alignment, or lawful force-status transitions.
- Add `toolchain_id=TC-EMAC-259`, `tool_suite_id=ts-homeland-emac-interstate-force-flow-synchronization-v1`, and `protocol_stack_id=ps-homeland-emac-interstate-force-flow-synchronization-stack-v1` when reserve or Guard mobilization depends on cross-state staging, EMAC demand, or reception-node throughput.
- Add `toolchain_id=TC-GOVRFF-260`, `tool_suite_id=ts-homeland-governor-request-for-forces-mission-assignment-v1`, and `protocol_stack_id=ps-homeland-governor-request-for-forces-mission-assignment-stack-v1` when mobilization recommendations depend on governor requests, mission-assignment timing, or sourcing priority.
- Add `packet_id=DPL-DUAL-STATUS-COMMAND-001`, `packet_id=DPL-EMAC-FORCE-FLOW-001`, and `packet_id=DPL-GOV-RFF-MISSION-ASSIGNMENT-001` for branches that materially alter mobilization posture, alert timelines, or force-employment authorities.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXXII Materialization Addendum)

- Add `toolchain_id=TC-HOUSING-240`, `tool_suite_id=ts-strategic-military-housing-utility-safety-and-restoration-v1`, and `protocol_stack_id=ps-strategic-military-housing-utility-safety-and-restoration-stack-v1` when reserve or Guard mobilization depends on installation housing habitability, utility safety, or family relocation capacity.
- Add `toolchain_id=TC-SCHOOL-248`, `tool_suite_id=ts-homeland-base-school-transport-and-dependent-evacuation-v1`, and `protocol_stack_id=ps-homeland-base-school-transport-and-dependent-evacuation-stack-v1` when mobilization confidence depends on dependent transport, school closure sequencing, or guardian reunification.
- Add `toolchain_id=TC-WORKFORCEFAM-249`, `tool_suite_id=ts-strategic-defense-industrial-workforce-family-stabilization-v1`, and `protocol_stack_id=ps-strategic-defense-industrial-workforce-family-stabilization-stack-v1` when mobilization branches depend on industrial-family stability, critical-worker continuity, or surge-support availability.
- Add `packet_id=DPL-MIL-HOUSING-UTILITY-001`, `packet_id=DPL-DEPENDENT-EVAC-001`, and `packet_id=DPL-WORKFORCE-FAMILY-STABILIZATION-001` for branches that materially alter mobilization posture, force availability, or family-support timing.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXIII Addendum)

- Add `toolchain_id=TC-LEGALAID-282`, `tool_suite_id=ts-homeland-military-legal-assistance-identity-document-reissuance-v1`, and `protocol_stack_id=ps-homeland-military-legal-assistance-identity-document-reissuance-stack-v1` when reserve or Guard mobilization confidence depends on legal-aid access, ID reissuance, or power-of-attorney continuity for affected households.
- Add `toolchain_id=TC-SPOUSE-287`, `tool_suite_id=ts-strategic-military-spouse-licensure-employment-pcs-continuity-v1`, and `protocol_stack_id=ps-strategic-military-spouse-licensure-employment-pcs-continuity-stack-v1` when mobilization readiness depends on spouse licensure portability, employment continuity, or PCS stability.
- Add `toolchain_id=TC-DEPENDENTCARE-288`, `tool_suite_id=ts-reserve-component-single-parent-childcare-eldercare-mobilization-bridge-v1`, and `protocol_stack_id=ps-reserve-component-single-parent-childcare-eldercare-mobilization-bridge-stack-v1` when activation timing depends on single-parent childcare, eldercare bridging, or dependent-care-plan recovery.
- Add `packet_id=DPL-LEGAL-AID-ID-REISSUE-001`, `packet_id=DPL-SPOUSE-LICENSURE-PCS-001`, and `packet_id=DPL-SINGLE-PARENT-ELDERCARE-MOB-001` for branches that materially alter mobilization posture, activation timing, or family-support confidence.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXIV Addendum)

- Add `toolchain_id=TC-ESGR-291`, `tool_suite_id=ts-reserve-component-employer-esgr-income-shock-continuity-v1`, and `protocol_stack_id=ps-reserve-component-employer-esgr-income-shock-continuity-stack-v1` when mobilization readiness depends on employer coordination, ESGR or USERRA friction, or household income-shock mitigation.
- Add `packet_id=DPL-EMPLOYER-ESGR-INCOME-SHOCK-001` for branches that materially alter activation timing, lawful employer engagement, or commander confidence in Reserve or Guard force flow.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXV Addendum)

- Add `toolchain_id=TC-ARCMSG-295`, `tool_suite_id=ts-joint-emergency-leave-american-red-cross-message-command-approval-v1`, and `protocol_stack_id=ps-joint-emergency-leave-american-red-cross-message-command-approval-stack-v1` when mobilization or backfill timing depends on verified family emergency leave, compassionate travel, or trusted message provenance.
- Add `toolchain_id=TC-PCSMOVE-298`, `tool_suite_id=ts-joint-pcs-claims-travel-voucher-temporary-lodging-continuity-v1`, and `protocol_stack_id=ps-joint-pcs-claims-travel-voucher-temporary-lodging-continuity-stack-v1` when activation confidence depends on unresolved PCS moves, travel-voucher backlog, or temporary lodging instability.
- Add `toolchain_id=TC-RELIEF-300`, `tool_suite_id=ts-joint-relief-society-hardship-grant-zero-interest-loan-bridge-v1`, and `protocol_stack_id=ps-joint-relief-society-hardship-grant-zero-interest-loan-bridge-stack-v1` when mobilization readiness depends on hardship stabilization, emergency travel funding, or relief-society assistance.
- Add `packet_id=DPL-EMERGENCY-LEAVE-ARC-001`, `packet_id=DPL-PCS-CLAIMS-LODGING-001`, and `packet_id=DPL-RELIEF-SOCIETY-HARDSHIP-001` for branches that materially alter activation timing, lawful force flow, or commander confidence in Reserve or Guard availability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVI Addendum)

- Add `toolchain_id=TC-SCRA-302`, `tool_suite_id=ts-joint-servicemembers-civil-relief-act-foreclosure-lease-eviction-rate-cap-enforcement-v1`, and `protocol_stack_id=ps-joint-servicemembers-civil-relief-act-foreclosure-lease-eviction-rate-cap-enforcement-stack-v1` when activation timing or lawful availability depends on SCRA foreclosure relief, lease termination, eviction protection, or rate-cap enforcement.
- Add `toolchain_id=TC-TAXID-304`, `tool_suite_id=ts-joint-military-tax-relief-combat-zone-entitlement-irs-identity-protection-v1`, and `protocol_stack_id=ps-joint-military-tax-relief-combat-zone-entitlement-irs-identity-protection-stack-v1` when mobilization confidence depends on combat-zone tax relief, tax-document continuity, or IRS identity-fraud containment.
- Add `toolchain_id=TC-FVAP-305`, `tool_suite_id=ts-joint-fvap-overseas-ballot-election-material-continuity-v1`, and `protocol_stack_id=ps-joint-fvap-overseas-ballot-election-material-continuity-stack-v1` when activation, overseas movement, or sustained deployment could jeopardize absentee-ballot continuity or lawful voting assistance.
- Add `packet_id=DPL-SCRA-HOUSING-CREDIT-001`, `packet_id=DPL-MILITARY-TAX-IDENTITY-001`, and `packet_id=DPL-FVAP-BALLOT-CONTINUITY-001` for branches that materially alter mobilization timing, household legal stability, or commander confidence in Reserve or Guard force availability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVII Addendum)

- Add `toolchain_id=TC-DRILLPAY-309`, `tool_suite_id=ts-reserve-component-drill-pay-travel-voucher-debt-resolution-v1`, and `protocol_stack_id=ps-reserve-component-drill-pay-travel-voucher-debt-resolution-stack-v1` when activation timing, lawful availability, or family stability depends on corrected drill pay, travel reimbursement, or debt resolution.
- Add `toolchain_id=TC-CLEAR-311`, `tool_suite_id=ts-joint-security-clearance-foreign-contact-record-correction-continuity-v1`, and `protocol_stack_id=ps-joint-security-clearance-foreign-contact-record-correction-continuity-stack-v1` when mobilization confidence depends on clearance status, foreign-contact adjudication, or record-correction speed.
- Add `toolchain_id=TC-FAMCARE-314`, `tool_suite_id=ts-joint-family-care-plan-child-support-allotment-court-order-continuity-v1`, and `protocol_stack_id=ps-joint-family-care-plan-child-support-allotment-court-order-continuity-stack-v1` when activation timing depends on valid family-care plans, support obligations, or court-order continuity.
- Add `packet_id=DPL-DRILL-PAY-DEBT-001`, `packet_id=DPL-CLEARANCE-RECORD-CORRECTION-001`, and `packet_id=DPL-FAMILY-CARE-ALLOTMENT-001` for branches that materially alter mobilization posture, lawful force flow, or commander confidence in Reserve or Guard availability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVIII Addendum)

- Add `toolchain_id=TC-DD93BEN-315`, `tool_suite_id=ts-joint-dd93-sgli-tsgli-beneficiary-estate-readiness-continuity-v1`, and `protocol_stack_id=ps-joint-dd93-sgli-tsgli-beneficiary-estate-readiness-continuity-stack-v1` when activation confidence depends on current DD93 status, beneficiary intent, or casualty-ready emergency-contact and estate documentation for mobilizing personnel.
- Add `toolchain_id=TC-VAHOME-317`, `tool_suite_id=ts-joint-va-home-loan-guaranty-foreclosure-avoidance-housing-stability-v1`, and `protocol_stack_id=ps-joint-va-home-loan-guaranty-foreclosure-avoidance-housing-stability-stack-v1` when reserve or Guard mobilization timing depends on preventing mortgage delinquency, failed closings, or housing instability in military households.
- Add `toolchain_id=TC-PROMO-318`, `tool_suite_id=ts-joint-promotion-board-evaluation-report-record-brief-continuity-v1`, and `protocol_stack_id=ps-joint-promotion-board-evaluation-report-record-brief-continuity-stack-v1` when force availability or assignment confidence depends on cleared board files, corrected evaluation reports, or trusted record-brief synchronization.
- Add `packet_id=DPL-DD93-SGLI-TSGLI-ESTATE-001`, `packet_id=DPL-VA-HOME-LOAN-HOUSING-001`, and `packet_id=DPL-PROMOTION-BOARD-RECORD-BRIEF-001` for branches that materially alter mobilization timing, lawful force flow, or commander confidence in Reserve or Guard availability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXIX Addendum)

- Add `toolchain_id=TC-GTCC-320`, `tool_suite_id=ts-joint-government-travel-charge-card-mission-travel-continuity-v1`, and `protocol_stack_id=ps-joint-government-travel-charge-card-mission-travel-continuity-stack-v1` when activation timing depends on lawful mission travel after card delinquency, suspended accounts, or reimbursement delay.
- Add `toolchain_id=TC-PAYINC-321`, `tool_suite_id=ts-joint-special-pay-bah-cola-incentive-continuity-v1`, and `protocol_stack_id=ps-joint-special-pay-bah-cola-incentive-continuity-stack-v1` when mobilization confidence depends on corrected BAH, COLA, special pay, or incentive obligations for critical personnel.
- Add `packet_id=DPL-GTCC-MISSION-TRAVEL-001` and `packet_id=DPL-SPECIAL-PAY-BAH-COLA-INCENTIVE-001` for branches that materially alter activation timing, lawful force flow, or commander confidence in Reserve or Guard availability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXI Addendum)

- Add `toolchain_id=TC-POV-324`, `tool_suite_id=ts-joint-pov-shipment-driver-license-registration-continuity-v1`, and `protocol_stack_id=ps-joint-pov-shipment-driver-license-registration-continuity-stack-v1` when activation timing or backfill reliability depends on lawful household transport, POV shipment recovery, or driver-license continuity.
- Add `toolchain_id=TC-CDCFEE-325`, `tool_suite_id=ts-joint-child-development-center-fee-assistance-duty-shift-continuity-v1`, and `protocol_stack_id=ps-joint-child-development-center-fee-assistance-duty-shift-continuity-stack-v1` when mobilization confidence depends on childcare placement, fee assistance, or duty-shift caregiver coverage for reserve-component households.
- Add `packet_id=DPL-POV-SHIPMENT-LICENSE-REG-001` and `packet_id=DPL-CDC-FEE-SHIFT-CONTINUITY-001` for branches that materially alter activation timing, lawful force flow, or commander confidence in Reserve or Guard availability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXII Addendum)

- Add `toolchain_id=TC-TBHEALTH-327`, `tool_suite_id=ts-joint-telebehavioral-health-burnout-suicide-risk-continuity-v1`, and `protocol_stack_id=ps-joint-telebehavioral-health-burnout-suicide-risk-continuity-stack-v1` when activation timing, retention, or household stability depends on remote behavioral-health continuity, burnout mitigation, or suicide-risk escalation.
- Add `toolchain_id=TC-HOMELESS-328`, `tool_suite_id=ts-joint-military-homelessness-prevention-transitional-housing-bridge-v1`, and `protocol_stack_id=ps-joint-military-homelessness-prevention-transitional-housing-bridge-stack-v1` when mobilization confidence depends on preventing household displacement, unsafe shelter, or homelessness during activation.
- Add `toolchain_id=TC-BANKR-329`, `tool_suite_id=ts-joint-bankruptcy-consumer-protection-clearance-financial-distress-v1`, and `protocol_stack_id=ps-joint-bankruptcy-consumer-protection-clearance-financial-distress-stack-v1` when debt distress, bankruptcy pressure, or creditor action threatens clearance posture, travel readiness, or lawful availability.
- Add `toolchain_id=TC-COMPASS-331`, `tool_suite_id=ts-joint-compassionate-reassignment-hardship-discharge-humanitarian-transfer-v1`, and `protocol_stack_id=ps-joint-compassionate-reassignment-hardship-discharge-humanitarian-transfer-stack-v1` when family crisis or caregiving breakdown may require compassionate routing, hardship discharge review, or backfill-adjusted force-flow decisions.
- Add `packet_id=DPL-TELEBEHAVIORAL-BURNOUT-SUICIDE-001`, `packet_id=DPL-HOMELESSNESS-TRANSITIONAL-HOUSING-001`, `packet_id=DPL-BANKRUPTCY-CLEARANCE-DISTRESS-001`, and `packet_id=DPL-COMPASSIONATE-REASSIGNMENT-HARDSHIP-001` for branches that materially alter activation timing, lawful force flow, or commander confidence in Reserve or Guard availability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXV Addendum)

- Add `toolchain_id=TC-PARENTAL-343`, `tool_suite_id=ts-joint-parental-leave-pregnancy-postpartum-profile-duty-modification-continuity-v1`, and `protocol_stack_id=ps-joint-parental-leave-pregnancy-postpartum-profile-duty-modification-continuity-stack-v1` when mobilization timing or backfill confidence depends on lawful parental leave, pregnancy or postpartum profile legitimacy, or safe duty restrictions.
- Add `toolchain_id=TC-LODPAY-346`, `tool_suite_id=ts-joint-line-of-duty-incapacitation-pay-duty-status-continuity-v1`, and `protocol_stack_id=ps-joint-line-of-duty-incapacitation-pay-duty-status-continuity-stack-v1` when activation or demobilization confidence depends on reconciled injury duty status, incapacitation pay, or LOD legitimacy.
- Add `toolchain_id=TC-FINALOUT-348`, `tool_suite_id=ts-joint-final-out-processing-cif-ocie-medical-dental-separation-clearance-v1`, and `protocol_stack_id=ps-joint-final-out-processing-cif-ocie-medical-dental-separation-clearance-stack-v1` when demobilization, release from active duty, or final-pay timing depends on clean separation-clearance execution.
- Add `packet_id=DPL-PARENTAL-LEAVE-PREG-POSTPARTUM-001`, `packet_id=DPL-LOD-INCAP-PAY-DUTY-STATUS-001`, and `packet_id=DPL-FINAL-OUT-CIF-SEPARATION-001` for branches that materially alter activation timing, lawful force flow, or commander confidence in Reserve or Guard availability.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXVI Addendum)

- Add `toolchain_id=TC-NJPSEP-349`, `tool_suite_id=ts-joint-nonjudicial-punishment-letter-of-reprimand-administrative-separation-continuity-v1`, and `protocol_stack_id=ps-joint-nonjudicial-punishment-letter-of-reprimand-administrative-separation-continuity-stack-v1` when adverse-action or separation exposure changes whether a member can mobilize, remain on orders, or fill a backfill slot.
- Add `toolchain_id=TC-SORCLR-352`, `tool_suite_id=ts-joint-security-clearance-suspension-revocation-statement-of-reasons-response-v1`, and `protocol_stack_id=ps-joint-security-clearance-suspension-revocation-statement-of-reasons-response-stack-v1` when suspension, revocation risk, or statement-of-reasons deadlines change mission access or mobilization viability.
- Add `packet_id=DPL-NJP-LOR-ADMINSEP-001` and `packet_id=DPL-CLEARANCE-SOR-SUSP-REVOCATION-001` for branches that materially alter activation timing, lawful force flow, or commander confidence in Reserve or Guard availability.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXVII Addendum)

- Add `toolchain_id=TC-IMR-332`, `tool_suite_id=ts-joint-individual-medical-readiness-immunization-pha-dental-continuity-v1`, and `protocol_stack_id=ps-joint-individual-medical-readiness-immunization-pha-dental-continuity-stack-v1` when activation timing or backfill confidence depends on IMR evidence, immunization status, PHA completion, or dental deployability.
- Add `toolchain_id=TC-LODINCAP-333`, `tool_suite_id=ts-reserve-component-line-of-duty-incapacitation-pay-medical-hold-continuity-v1`, and `protocol_stack_id=ps-reserve-component-line-of-duty-incapacitation-pay-medical-hold-continuity-stack-v1` when mobilization confidence depends on resolving LOD legitimacy, incapacitation-pay continuity, or medical-hold status for injured or recovering members.
- Add `toolchain_id=TC-FAMNET-335`, `tool_suite_id=ts-joint-family-readiness-group-ombudsman-key-spouse-communication-v1`, and `protocol_stack_id=ps-joint-family-readiness-group-ombudsman-key-spouse-communication-stack-v1` when activation confidence depends on trusted household communication, verified volunteer-network messaging, or rumor-control stability.
- Add `toolchain_id=TC-ONESOURCE-336`, `tool_suite_id=ts-joint-military-onesource-nonmedical-counseling-peer-support-v1`, and `protocol_stack_id=ps-joint-military-onesource-nonmedical-counseling-peer-support-stack-v1` when mobilization timing, retention, or household resilience depends on non-medical counseling access or peer-support continuity.
- Add `packet_id=DPL-IMR-PHA-DENTAL-001`, `packet_id=DPL-LOD-INCAP-MEDHOLD-001`, `packet_id=DPL-FRG-OMBUDSMAN-KEY-SPOUSE-001`, and `packet_id=DPL-ONESOURCE-PEER-SUPPORT-001` for branches that materially alter activation timing, lawful force flow, or commander confidence in Reserve or Guard availability.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXVIII Addendum)

- Add `toolchain_id=TC-RESRET-355`, `tool_suite_id=ts-reserve-component-retirement-points-sanctuary-nonregular-retirement-continuity-v1`, and `protocol_stack_id=ps-reserve-component-retirement-points-sanctuary-nonregular-retirement-continuity-stack-v1` when mobilization timing or retention confidence depends on accurate retirement credit, sanctuary calculations, or long-horizon service legitimacy.
- Add `toolchain_id=TC-TRSRES-356`, `tool_suite_id=ts-reserve-component-tricare-reserve-select-retired-reserve-dental-eligibility-bridge-v1`, and `protocol_stack_id=ps-reserve-component-tricare-reserve-select-retired-reserve-dental-eligibility-bridge-stack-v1` when lawful force flow depends on preserving Reserve household healthcare continuity during activation or demobilization change.
- Add `toolchain_id=TC-EFMPSL-357`, `tool_suite_id=ts-joint-efmp-enrollment-assignment-coordination-school-liaison-continuity-v1`, and `protocol_stack_id=ps-joint-efmp-enrollment-assignment-coordination-school-liaison-continuity-stack-v1` when mobilization viability depends on special-needs family assignment screening, command sponsorship, or school-support continuity.
- Add `toolchain_id=TC-PMHOUS-360`, `tool_suite_id=ts-joint-privatized-military-housing-tenant-rights-bah-recertification-claims-v1`, and `protocol_stack_id=ps-joint-privatized-military-housing-tenant-rights-bah-recertification-claims-stack-v1` when unsafe housing, BAH recertification friction, or unresolved claims change whether a Reserve household can absorb activation.
- Add `toolchain_id=TC-HUMREAD-361`, `tool_suite_id=ts-joint-command-team-human-readiness-case-conference-escalation-v1`, and `protocol_stack_id=ps-joint-command-team-human-readiness-case-conference-escalation-stack-v1` when mobilization confidence depends on deliberate command integration across medical, legal, family, housing, and finance lanes.
- Add `packet_id=DPL-RESERVE-RETIREMENT-SANCTUARY-001`, `packet_id=DPL-TRS-TRR-DENTAL-ELIGIBILITY-001`, `packet_id=DPL-EFMP-ASSIGNMENT-SCHOOL-001`, `packet_id=DPL-PRIVATIZED-HOUSING-BAH-CLAIMS-001`, and `packet_id=DPL-HUMAN-READINESS-CASE-CONFERENCE-001` for branches that materially alter mobilization timing, lawful force flow, or commander confidence in Reserve or Guard availability.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXIX Addendum)

- Add `toolchain_id=TC-UATOUR-362`, `tool_suite_id=ts-joint-unaccompanied-tour-family-separation-allowance-deferred-travel-continuity-v1`, and `protocol_stack_id=ps-joint-unaccompanied-tour-family-separation-allowance-deferred-travel-continuity-stack-v1` when mobilization confidence depends on separated-family legitimacy, unaccompanied-tour order integrity, or deferred-dependent-travel stability for affected members.
- Add `toolchain_id=TC-TAXDOM-363`, `tool_suite_id=ts-joint-state-tax-domicile-residency-withholding-continuity-v1`, and `protocol_stack_id=ps-joint-state-tax-domicile-residency-withholding-continuity-stack-v1` when activation timing or household resilience depends on resolving state-tax conflict, domicile mismatch, or withholding drift.
- Add `toolchain_id=TC-SCHTRN-364`, `tool_suite_id=ts-joint-military-child-school-transfer-transcript-graduation-continuity-v1`, and `protocol_stack_id=ps-joint-military-child-school-transfer-transcript-graduation-continuity-stack-v1` when mobilization viability depends on dependent school-transfer timing, transcript survivability, or graduation continuity.
- Add `toolchain_id=TC-AUTOFIN-365`, `tool_suite_id=ts-joint-consumer-auto-loan-repossession-insurance-gap-transportation-continuity-v1`, and `protocol_stack_id=ps-joint-consumer-auto-loan-repossession-insurance-gap-transportation-continuity-stack-v1` when mobilization confidence depends on protecting lawful household transport from repossession exposure, insurance failure, or lender-driven shock.
- Add `packet_id=DPL-UNACCOMP-FSA-DEFER-001`, `packet_id=DPL-STATE-TAX-DOMICILE-001`, `packet_id=DPL-SCHOOL-TRANSFER-GRAD-001`, and `packet_id=DPL-AUTO-REPO-TRANSPORT-001` for branches that materially alter activation timing, lawful force flow, or commander confidence in Reserve or Guard availability.
