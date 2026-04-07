---
name: joint-personnel-records-dd214-and-benefits-continuity-cell
description: Preserve personnel-record integrity, DD214 issuance, and benefits handoff continuity during outages, mobilization surges, casualty shocks, or separation backlogs. Use when record failures threaten readiness, transition, or family support.
---

# Joint Personnel Records DD214 And Benefits Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter personnel-record and transition-continuity decisions.
- Confirm affected population, record-system availability, separation or casualty timelines, identity-proofing posture, and benefits handoff dependencies before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using outage scope, affected servicemembers, timeline pressure, veteran or family impact, and command decision deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in record integrity, transition speed, privacy protection, and staff burden.
3. Identify branch triggers for partial-record reconstruction, DD214 prioritization, benefits escalation, casualty-document hold, and identity-proof failure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and records-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: personnel-record recovery board, DD214 issuance ladder, and benefits continuity tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-personnel-records-dd214-benefits-continuity-v1` with `protocol_stack_id=ps-joint-personnel-records-dd214-benefits-continuity-stack-v1`.
- Alternate: select a mission-adjacent reserve-readiness, casualty-assistance, or pay-continuity suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manually certified priority case list with no final discharge-document recommendation beyond verified human record review.

## Domain Packet Defaults

- Default packet ID: `DPL-PERSONNEL-RECORDS-DD214-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: personnel record synchronization board, DD214 production queue, identity-proofing review cell, and benefits handoff ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed personnel manifests, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If identity proof, source-record integrity, or release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity across record handoffs.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag record loss, duplicate identity, delayed discharge documentation, unverified benefits assumptions, and privacy leakage before recommending action.
- Do not fabricate personnel status, discharge documents, entitlement decisions, or veteran handoff completion.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXV Addendum)

- Add `toolchain_id=TC-SURVIVOR-297`, `tool_suite_id=ts-joint-survivor-benefits-casualty-assistance-records-expedite-v1`, and `protocol_stack_id=ps-joint-survivor-benefits-casualty-assistance-records-expedite-stack-v1` when records continuity depends on casualty-linked beneficiary verification, survivor-benefits initiation, or rapid reconstruction of authoritative source data.
- Add `toolchain_id=TC-PCSMOVE-298`, `tool_suite_id=ts-joint-pcs-claims-travel-voucher-temporary-lodging-continuity-v1`, and `protocol_stack_id=ps-joint-pcs-claims-travel-voucher-temporary-lodging-continuity-stack-v1` when DD214, separation, or transfer records are needed to resolve PCS claims, travel-voucher evidence, or lodging reimbursement legitimacy.
- Add `packet_id=DPL-SURVIVOR-BENEFITS-CASUALTY-001` and `packet_id=DPL-PCS-CLAIMS-LODGING-001` for branches that materially alter entitlement confidence, record-reconstruction priority, or transition-support legitimacy.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVI Addendum)

- Add `toolchain_id=TC-EDBEN-301`, `tool_suite_id=ts-joint-education-benefits-gi-bill-tuition-assistance-testing-continuity-v1`, and `protocol_stack_id=ps-joint-education-benefits-gi-bill-tuition-assistance-testing-continuity-stack-v1` when DD214, transfer, or eligibility-record continuity is required to restore GI Bill, tuition-assistance, or testing legitimacy.
- Add `toolchain_id=TC-NATURAL-303`, `tool_suite_id=ts-joint-naturalization-citizenship-immigration-benefits-continuity-v1`, and `protocol_stack_id=ps-joint-naturalization-citizenship-immigration-benefits-continuity-stack-v1` when personnel-record integrity or service certification is needed for naturalization, immigration filing continuity, or family-status protection.
- Add `toolchain_id=TC-TAXID-304`, `tool_suite_id=ts-joint-military-tax-relief-combat-zone-entitlement-irs-identity-protection-v1`, and `protocol_stack_id=ps-joint-military-tax-relief-combat-zone-entitlement-irs-identity-protection-stack-v1` when tax-relief legitimacy depends on authoritative service records, combat-zone evidence, or reconstructed tax documents.
- Add `packet_id=DPL-ED-BENEFITS-GIBILL-001`, `packet_id=DPL-NATURALIZATION-IMMIGRATION-001`, and `packet_id=DPL-MILITARY-TAX-IDENTITY-001` for branches that materially alter transition legitimacy, service-certification trust, or benefits-record continuity.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVII Addendum)

- Add `toolchain_id=TC-DEERS-307`, `tool_suite_id=ts-joint-deers-id-card-eligibility-reconciliation-v1`, and `protocol_stack_id=ps-joint-deers-id-card-eligibility-reconciliation-stack-v1` when personnel-record restoration depends on sponsor-dependent eligibility correction, ID-card validity, or entitlement reconciliation.
- Add `toolchain_id=TC-MEBPEB-308`, `tool_suite_id=ts-joint-medical-evaluation-board-physical-evaluation-board-va-claim-continuity-v1`, and `protocol_stack_id=ps-joint-medical-evaluation-board-physical-evaluation-board-va-claim-continuity-stack-v1` when DD214, separation, or service-certification trust depends on board evidence, duty disposition, or disability-transition continuity.
- Add `toolchain_id=TC-RETIRE-312`, `tool_suite_id=ts-joint-retirement-sbp-tsp-transition-counseling-continuity-v1`, and `protocol_stack_id=ps-joint-retirement-sbp-tsp-transition-counseling-continuity-stack-v1` when authoritative records are needed to validate retirement eligibility, SBP elections, or TSP transition counseling.
- Add `packet_id=DPL-DEERS-ID-ELIGIBILITY-001`, `packet_id=DPL-MEB-PEB-VA-CLAIM-001`, and `packet_id=DPL-RETIREMENT-SBP-TSP-001` for branches that materially alter record-reconstruction priority, transition legitimacy, or benefits trust.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVIII Addendum)

- Add `toolchain_id=TC-DD93BEN-315`, `tool_suite_id=ts-joint-dd93-sgli-tsgli-beneficiary-estate-readiness-continuity-v1`, and `protocol_stack_id=ps-joint-dd93-sgli-tsgli-beneficiary-estate-readiness-continuity-stack-v1` when records continuity depends on authoritative DD93 status, beneficiary trust, or TSGLI or SGLI evidence needed for casualty or transition actions.
- Add `toolchain_id=TC-SKILLBRIDGE-316`, `tool_suite_id=ts-joint-skillbridge-career-skills-apprenticeship-employer-fellowship-continuity-v1`, and `protocol_stack_id=ps-joint-skillbridge-career-skills-apprenticeship-employer-fellowship-continuity-stack-v1` when service records, DD214 timing, or separation status must be trusted to preserve SkillBridge, apprenticeship, or fellowship legitimacy.
- Add `toolchain_id=TC-PROMO-318`, `tool_suite_id=ts-joint-promotion-board-evaluation-report-record-brief-continuity-v1`, and `protocol_stack_id=ps-joint-promotion-board-evaluation-report-record-brief-continuity-stack-v1` when assignment or board-file trust depends on corrected evaluation records, synchronized record briefs, or authoritative personnel data.
- Add `packet_id=DPL-DD93-SGLI-TSGLI-ESTATE-001`, `packet_id=DPL-SKILLBRIDGE-CSP-001`, and `packet_id=DPL-PROMOTION-BOARD-RECORD-BRIEF-001` for branches that materially alter record-reconstruction priority, transition legitimacy, or assignment trust.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXI Addendum)

- Add `toolchain_id=TC-CMDSP-323`, `tool_suite_id=ts-joint-command-sponsorship-overseas-screening-no-fee-passport-continuity-v1`, and `protocol_stack_id=ps-joint-command-sponsorship-overseas-screening-no-fee-passport-continuity-stack-v1` when authoritative sponsor data, family composition, or dependent-document continuity is required to restore overseas movement legitimacy.
- Add `toolchain_id=TC-STULOAN-326`, `tool_suite_id=ts-joint-federal-student-loan-deferment-fafsa-college-reentry-continuity-v1`, and `protocol_stack_id=ps-joint-federal-student-loan-deferment-fafsa-college-reentry-continuity-stack-v1` when service-record integrity, mobilization evidence, or transition-document continuity is required to restore student-loan protections, FAFSA legitimacy, or academic reentry.
- Add `packet_id=DPL-CMD-SPONSOR-OVERSEAS-SCREEN-001` and `packet_id=DPL-STUDENT-LOAN-FAFSA-REENTRY-001` for branches that materially alter record-reconstruction priority, family-movement legitimacy, or education-benefit trust.
