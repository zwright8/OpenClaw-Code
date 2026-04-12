---
name: joint-command-sponsorship-overseas-screening-and-no-fee-passport-continuity-cell
description: Preserve command sponsorship, overseas screening, no-fee passports, and dependent movement eligibility when PCS, assignment, or emergency relocation friction could strand U.S. warfighters or families and degrade mission readiness.
---

# Joint Command Sponsorship Overseas Screening And No Fee Passport Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter command-sponsorship, overseas-screening, and family-movement continuity decisions.
- Confirm assignment or PCS posture, sponsor status, overseas medical or EFMP screening requirements, passport or visa deadlines, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII or medical detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using orders posture, command-sponsorship status, overseas screening backlog, travel-document risk, and movement deadline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in family movement speed, medical legitimacy, assignment stability, and administrative burden.
3. Identify branch triggers for missing screening evidence, no-fee passport delay, dependent travel ineligibility, EFMP mismatch, and host-nation or safehaven document friction.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and family-movement risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: command-sponsorship recovery board, overseas-screening ladder, and no-fee passport movement packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-CMDSP-323`, `tool_suite_id=ts-joint-command-sponsorship-overseas-screening-no-fee-passport-continuity-v1`, and `protocol_stack_id=ps-joint-command-sponsorship-overseas-screening-no-fee-passport-continuity-stack-v1`.
- Alternate: select a mission-adjacent passport, consular, DEERS, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual family-movement risk roster with advisory-only sequencing until sponsor status, screening evidence, and travel-document posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-CMD-SPONSOR-OVERSEAS-SCREEN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: command-sponsorship case board, overseas screening tracker, no-fee passport or visa queue, and dependent movement ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `ICAO Doc 9303`, signed sponsor notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If command sponsorship, screening evidence, or document authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and movement-eligibility clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported family-movement promises, medical-screening shortcuts, no-fee passport assumptions, and host-nation acceptance risk before recommending action.
- Do not fabricate command sponsorship, medical clearance, passport issuance, or travel acceptance.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXV Addendum)

- Add `toolchain_id=TC-NEWBORN-344`, `tool_suite_id=ts-joint-newborn-birth-certificate-deers-tricare-travel-document-bridge-v1`, and `protocol_stack_id=ps-joint-newborn-birth-certificate-deers-tricare-travel-document-bridge-stack-v1` when family-movement legitimacy depends on newborn civil-registration evidence, DEERS or TRICARE activation, or new dependent travel-document readiness before overseas movement.
- Add `packet_id=DPL-NEWBORN-DEERS-TRICARE-DOCS-001` for branches that materially alter command-sponsorship sequencing, dependent-movement legitimacy, or overseas family-travel confidence.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXIX Addendum)

- Add `toolchain_id=TC-UATOUR-362`, `tool_suite_id=ts-joint-unaccompanied-tour-family-separation-allowance-deferred-travel-continuity-v1`, and `protocol_stack_id=ps-joint-unaccompanied-tour-family-separation-allowance-deferred-travel-continuity-stack-v1` when family-movement sequencing depends on unaccompanied-tour order integrity, family-separation-allowance legitimacy, or deferred-dependent-travel clarity for a separated household.
- Add `packet_id=DPL-UNACCOMP-FSA-DEFER-001` for branches that materially alter command-sponsorship sequencing, deferred-family-travel legitimacy, or overseas movement confidence.

## Domain Toolchain Override (2026-04-11, Expansion Wave XCIV Addendum)

- Add `toolchain_id=TC-SOFA-391`, `tool_suite_id=ts-joint-overseas-spouse-work-authorization-host-nation-banking-driver-license-continuity-v1`, and `protocol_stack_id=ps-joint-overseas-spouse-work-authorization-host-nation-banking-driver-license-continuity-stack-v1` when family-movement legitimacy depends on a spouse being able to lawfully work, open bank access, or drive after arrival instead of only clearing the initial sponsorship gate.
- Add `packet_id=DPL-SPOUSE-WORKAUTH-BANK-DRIVER-001` for branches that materially alter sponsorship sequencing, overseas household legality, or commander confidence in dependent movement viability.

## Domain Toolchain Override (2026-04-12, Expansion Wave XCV Addendum)

- Add `toolchain_id=TC-OHA-397`, `tool_suite_id=ts-joint-overseas-housing-allowance-utility-reconciliation-lease-continuity-v1`, and `protocol_stack_id=ps-joint-overseas-housing-allowance-utility-reconciliation-lease-continuity-stack-v1` when command-sponsorship viability depends on whether a family can actually secure and sustain lawful overseas housing after movement approval.
- Add `toolchain_id=TC-OCOLA-398`, `tool_suite_id=ts-joint-overseas-cola-post-allowance-currency-shock-continuity-v1`, and `protocol_stack_id=ps-joint-overseas-cola-post-allowance-currency-shock-continuity-stack-v1` when family-movement legitimacy depends on whether overseas cost shocks will immediately destabilize the assigned household.
- Add `toolchain_id=TC-SPACEA-400`, `tool_suite_id=ts-joint-space-available-travel-emergency-leave-nonmedical-attendant-priority-continuity-v1`, and `protocol_stack_id=ps-joint-space-available-travel-emergency-leave-nonmedical-attendant-priority-continuity-stack-v1` when command sponsorship, travel-document posture, or compassionate-movement timing must be synchronized under disrupted overseas travel conditions.
- Add `packet_id=DPL-OHA-LEASE-UTILITY-001`, `packet_id=DPL-OCOLA-POST-CURRENCY-001`, and `packet_id=DPL-SPACEA-EMERGENCY-ATTENDANT-001` for branches that materially alter sponsorship sequencing, overseas household viability, or commander confidence in lawful movement support.
