---
name: joint-military-financial-liability-and-compensation-continuity-cell
description: Maintain claims, compensation, and fiscal legitimacy when military operations trigger damage, liability, or emergency-relief decisions.
---

# Joint Military Financial Liability And Compensation Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter liability, compensation, and emergency-relief continuity decisions.
- Confirm fiscal authorities, claims posture, adjudication timelines, evidence integrity, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using damage claims, emergency-relief demand, fraud risk, evidence status, and fiscal authority constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legitimacy, speed, fraud exposure, and mission impact.
3. Identify branch triggers for interim relief, claims hold, fraud escalation, legal review, and compensation reprioritization.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: claims continuity board, interim-relief decision log, compensation legitimacy matrix, and fraud-escalation tracker.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-COMPENSATION-243`, `tool_suite_id=ts-joint-military-financial-liability-and-compensation-continuity-v1`, and `protocol_stack_id=ps-joint-military-financial-liability-and-compensation-continuity-stack-v1`.
- Alternate: select a mission-adjacent finance, claims, or civil-affairs suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual claims ledger with command-approved interim relief decisions and no automated disbursement until fiscal controls are revalidated.

## Domain Packet Defaults

- Default packet IDs: `DPL-COMPENSATION-CONTINUITY-001` and `DPL-INTERIM-RELIEF-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: claims adjudication board, emergency-relief disbursement tracker, evidence ledger, and fraud-anomaly monitor.
- Preferred protocol profiles for coordination and machine exchange: signed claims manifests, `NIEM`, `API/JSON`, `S/MIME`, `STIX/TAXII`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If fiscal authority, claims evidence, or fraud posture is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported compensation promises, fraud-control gaps, fiscal-legitimacy risk, and evidence shortfalls before recommending action.
- Do not fabricate claims status, payout authority, evidence holdings, or approvals.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVI Addendum)

- Add `toolchain_id=TC-TAXID-304`, `tool_suite_id=ts-joint-military-tax-relief-combat-zone-entitlement-irs-identity-protection-v1`, and `protocol_stack_id=ps-joint-military-tax-relief-combat-zone-entitlement-irs-identity-protection-stack-v1` when fiscal legitimacy, relief timing, or compensation confidence depends on combat-zone tax relief, document continuity, or IRS identity-fraud containment.
- Add `toolchain_id=TC-CREDIT-306`, `tool_suite_id=ts-joint-credit-identity-theft-financial-readiness-recovery-v1`, and `protocol_stack_id=ps-joint-credit-identity-theft-financial-readiness-recovery-stack-v1` when emergency relief, fraud adjudication, or compensation continuity depends on restored financial identity and credit access.
- Add `packet_id=DPL-MILITARY-TAX-IDENTITY-001` and `packet_id=DPL-CREDIT-IDENTITY-RECOVERY-001` for branches that materially alter compensation legitimacy, emergency-assistance confidence, or household financial stability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXVII Addendum)

- Add `toolchain_id=TC-DRILLPAY-309`, `tool_suite_id=ts-reserve-component-drill-pay-travel-voucher-debt-resolution-v1`, and `protocol_stack_id=ps-reserve-component-drill-pay-travel-voucher-debt-resolution-stack-v1` when fiscal legitimacy or emergency-relief timing depends on corrected drill pay, reimbursable travel, or erroneous debt resolution.
- Add `toolchain_id=TC-RETIRE-312`, `tool_suite_id=ts-joint-retirement-sbp-tsp-transition-counseling-continuity-v1`, and `protocol_stack_id=ps-joint-retirement-sbp-tsp-transition-counseling-continuity-stack-v1` when compensation continuity depends on retirement packet integrity, SBP elections, or TSP counseling timing.
- Add `packet_id=DPL-DRILL-PAY-DEBT-001` and `packet_id=DPL-RETIREMENT-SBP-TSP-001` for branches that materially alter compensation legitimacy, interim-relief confidence, or household financial stability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXIX Addendum)

- Add `toolchain_id=TC-GTCC-320`, `tool_suite_id=ts-joint-government-travel-charge-card-mission-travel-continuity-v1`, and `protocol_stack_id=ps-joint-government-travel-charge-card-mission-travel-continuity-stack-v1` when compensation legitimacy or household stability depends on clearing official-travel delinquency, card suspension, or reimbursement aging.
- Add `toolchain_id=TC-PAYINC-321`, `tool_suite_id=ts-joint-special-pay-bah-cola-incentive-continuity-v1`, and `protocol_stack_id=ps-joint-special-pay-bah-cola-incentive-continuity-stack-v1` when claims, hardship relief, or retention confidence depends on corrected BAH, COLA, special pay, or incentive obligations.
- Add `packet_id=DPL-GTCC-MISSION-TRAVEL-001` and `packet_id=DPL-SPECIAL-PAY-BAH-COLA-INCENTIVE-001` for branches that materially alter compensation legitimacy, interim-relief confidence, or household financial stability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXI Addendum)

- Add `toolchain_id=TC-STULOAN-326`, `tool_suite_id=ts-joint-federal-student-loan-deferment-fafsa-college-reentry-continuity-v1`, and `protocol_stack_id=ps-joint-federal-student-loan-deferment-fafsa-college-reentry-continuity-stack-v1` when household financial stability, retention confidence, or hardship sequencing depends on student-loan protection, FAFSA continuity, or academic reentry for warfighters or dependents.
- Add `packet_id=DPL-STUDENT-LOAN-FAFSA-REENTRY-001` for branches that materially alter compensation legitimacy, hardship-confidence, or household financial stability.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXV Addendum)

- Add `toolchain_id=TC-LODPAY-346`, `tool_suite_id=ts-joint-line-of-duty-incapacitation-pay-duty-status-continuity-v1`, and `protocol_stack_id=ps-joint-line-of-duty-incapacitation-pay-duty-status-continuity-stack-v1` when compensation legitimacy depends on LOD evidence, incapacitation-pay routing, or injury-driven duty-status reconciliation.
- Add `toolchain_id=TC-FINALOUT-348`, `tool_suite_id=ts-joint-final-out-processing-cif-ocie-medical-dental-separation-clearance-v1`, and `protocol_stack_id=ps-joint-final-out-processing-cif-ocie-medical-dental-separation-clearance-stack-v1` when final-pay timing, separation checklist completion, or property-accountability closure changes compensation confidence.
- Add `packet_id=DPL-LOD-INCAP-PAY-DUTY-STATUS-001` and `packet_id=DPL-FINAL-OUT-CIF-SEPARATION-001` for branches that materially alter compensation legitimacy, final-pay confidence, or transition-finance stability.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXVI Addendum)

- Add `toolchain_id=TC-SORCLR-352`, `tool_suite_id=ts-joint-security-clearance-suspension-revocation-statement-of-reasons-response-v1`, and `protocol_stack_id=ps-joint-security-clearance-suspension-revocation-statement-of-reasons-response-stack-v1` when debt distress, tax liens, or creditor action escalate into formal suspension, revocation, or statement-of-reasons response posture.
- Add `toolchain_id=TC-DRBBCMR-353`, `tool_suite_id=ts-joint-discharge-review-board-bcmr-character-of-service-va-eligibility-bridge-v1`, and `protocol_stack_id=ps-joint-discharge-review-board-bcmr-character-of-service-va-eligibility-bridge-stack-v1` when compensation or debt recovery intersects discharge characterization, record defects, or downstream VA-eligibility risk.
- Add `packet_id=DPL-CLEARANCE-SOR-SUSP-REVOCATION-001` and `packet_id=DPL-DRB-BCMR-CHARACTER-VA-001` for branches that materially alter compensation legitimacy, adjudication-defense confidence, or long-tail financial recovery.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXVII Addendum)

- Add `toolchain_id=TC-LODINCAP-333`, `tool_suite_id=ts-reserve-component-line-of-duty-incapacitation-pay-medical-hold-continuity-v1`, and `protocol_stack_id=ps-reserve-component-line-of-duty-incapacitation-pay-medical-hold-continuity-stack-v1` when compensation continuity, household stability, or lawful availability depends on verified LOD determinations, incapacitation-pay continuity, or medical-hold legitimacy.
- Add `packet_id=DPL-LOD-INCAP-MEDHOLD-001` for branches that materially alter compensation legitimacy, recovery confidence, or household financial stability.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXVIII Addendum)

- Add `toolchain_id=TC-RESRET-355`, `tool_suite_id=ts-reserve-component-retirement-points-sanctuary-nonregular-retirement-continuity-v1`, and `protocol_stack_id=ps-reserve-component-retirement-points-sanctuary-nonregular-retirement-continuity-stack-v1` when long-horizon compensation confidence depends on accurate Reserve retirement credit, sanctuary math, or retirement-status legitimacy.
- Add `toolchain_id=TC-TRSRES-356`, `tool_suite_id=ts-reserve-component-tricare-reserve-select-retired-reserve-dental-eligibility-bridge-v1`, and `protocol_stack_id=ps-reserve-component-tricare-reserve-select-retired-reserve-dental-eligibility-bridge-stack-v1` when household financial stability depends on preserving Reserve health-plan continuity and avoiding unexpected premium or care shocks.
- Add `toolchain_id=TC-MYCAA-359`, `tool_suite_id=ts-strategic-military-spouse-mycaa-portable-training-career-reentry-v1`, and `protocol_stack_id=ps-strategic-military-spouse-mycaa-portable-training-career-reentry-stack-v1` when spouse training continuity or career reentry materially changes household income stability and compensation-risk posture.
- Add `toolchain_id=TC-PMHOUS-360`, `tool_suite_id=ts-joint-privatized-military-housing-tenant-rights-bah-recertification-claims-v1`, and `protocol_stack_id=ps-joint-privatized-military-housing-tenant-rights-bah-recertification-claims-stack-v1` when compensation legitimacy depends on correct BAH posture, housing claims recovery, or avoiding privatized-housing billing harm.
- Add `packet_id=DPL-RESERVE-RETIREMENT-SANCTUARY-001`, `packet_id=DPL-TRS-TRR-DENTAL-ELIGIBILITY-001`, `packet_id=DPL-MYCAA-TRAINING-CAREER-001`, and `packet_id=DPL-PRIVATIZED-HOUSING-BAH-CLAIMS-001` for branches that materially alter compensation legitimacy, household financial stability, or retention confidence.

## Domain Toolchain Override (2026-04-11, Expansion Wave XC Addendum)

- Add `toolchain_id=TC-MYPAY-366`, `tool_suite_id=ts-joint-mypay-les-allotment-payroll-access-continuity-v1`, and `protocol_stack_id=ps-joint-mypay-les-allotment-payroll-access-continuity-stack-v1` when compensation legitimacy depends on trusted payroll access, corrected LES data, or protected allotments.
- Add `toolchain_id=TC-REENLIST-367`, `tool_suite_id=ts-joint-reenlistment-selective-retention-bonus-career-field-reclassification-continuity-v1`, and `protocol_stack_id=ps-joint-reenlistment-selective-retention-bonus-career-field-reclassification-continuity-stack-v1` when SRB legitimacy, reenlistment timing, or reclassification routing materially changes financial stability or retention confidence.
- Add `toolchain_id=TC-LEAVE-370`, `tool_suite_id=ts-joint-leave-carryover-special-leave-accrual-sell-back-continuity-v1`, and `protocol_stack_id=ps-joint-leave-carryover-special-leave-accrual-sell-back-continuity-stack-v1` when use-or-lose exposure, SLA posture, or sell-back timing materially changes fiscal legitimacy or household stability.
- Add `packet_id=DPL-MYPAY-LES-ALLOTMENT-001`, `packet_id=DPL-REENLISTMENT-SRB-RECLASS-001`, and `packet_id=DPL-LEAVE-SLA-SELLBACK-001` for branches that materially alter compensation legitimacy, household financial stability, or retention confidence.

## Domain Toolchain Override (2026-04-11, Expansion Wave XCI Addendum)

- Add `toolchain_id=TC-BRSCP-372`, `tool_suite_id=ts-joint-blended-retirement-continuation-pay-mid-career-opt-in-continuity-v1`, and `protocol_stack_id=ps-joint-blended-retirement-continuation-pay-mid-career-opt-in-continuity-stack-v1` when compensation legitimacy, retention confidence, or household planning depends on BRS opt-in timing, continuation-pay routing, or obligated-service evidence.
- Add `toolchain_id=TC-TSPHL-373`, `tool_suite_id=ts-joint-thrift-savings-plan-loan-hardship-withdrawal-beneficiary-continuity-v1`, and `protocol_stack_id=ps-joint-thrift-savings-plan-loan-hardship-withdrawal-beneficiary-continuity-stack-v1` when emergency liquidity, beneficiary intent, or retirement-savings control materially changes household financial stability.
- Add `toolchain_id=TC-MSTAR-376`, `tool_suite_id=ts-joint-military-star-exchange-credit-essential-purchase-continuity-v1`, and `protocol_stack_id=ps-joint-military-star-exchange-credit-essential-purchase-continuity-stack-v1` when exchange-credit disruption, essential-purchase friction, or hardship repayment materially changes compensation confidence or family resilience.
- Add `packet_id=DPL-BRS-CONTPAY-OPTIN-001`, `packet_id=DPL-TSP-LOAN-HARDSHIP-BENEFICIARY-001`, and `packet_id=DPL-MILITARY-STAR-EXCHANGE-CREDIT-001` for branches that materially alter compensation legitimacy, household financial stability, or mid-career retention confidence.
