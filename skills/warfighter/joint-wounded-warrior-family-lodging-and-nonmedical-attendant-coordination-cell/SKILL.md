---
name: joint-wounded-warrior-family-lodging-and-nonmedical-attendant-coordination-cell
description: Coordinate family lodging, nonmedical attendant support, and bedside travel for wounded warfighters across the care chain. Use when patient movement and recovery depend on timely family presence without breaking medical-regulation discipline.
---

# Joint Wounded Warrior Family Lodging And Nonmedical Attendant Coordination Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter casualty care where family travel, temporary lodging, or nonmedical attendant approval affects recovery and patient movement.
- Confirm patient category, care location, attendant eligibility, lodging constraints, and commander or clinical decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using casualty flow, bedside support demand, attendant approval posture, lodging availability, and travel constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in patient support, privacy, travel burden, and command legitimacy.
3. Identify branch triggers for NMA approval delay, lodging overflow, bedside-contact restriction, and transfer to rehabilitation or VA care.
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

Primary products: family lodging board, nonmedical attendant approval ladder, and bedside-support continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-NMA-294`, `tool_suite_id=ts-joint-wounded-warrior-family-lodging-nonmedical-attendant-coordination-v1`, and `protocol_stack_id=ps-joint-wounded-warrior-family-lodging-nonmedical-attendant-coordination-stack-v1`.
- Alternate: select a mission-adjacent casualty-regulation, rehabilitation, or family-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual travel and lodging roster with advisory-only attendant sequencing until medical and travel authority are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-WOUNDED-WARRIOR-FAMILY-ATTENDANT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: patient-family support board, nonmedical attendant tracker, lodging-capacity queue, and travel-order or reimbursement ledger.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed travel orders, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If patient consent, clinical posture, or travel authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect patient privacy, attendant eligibility, reimbursement legitimacy, and bedside-access rules before recommending action.
- Do not fabricate approvals, lodging capacity, patient status, or travel entitlements.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXXIII Addendum)

- Add `toolchain_id=TC-TAMPHC-332`, `tool_suite_id=ts-joint-transitional-healthcare-tamp-chcbp-pharmacy-bridge-v1`, and `protocol_stack_id=ps-joint-transitional-healthcare-tamp-chcbp-pharmacy-bridge-stack-v1` when bedside-support continuity spans separation, demobilization, or medical transition and depends on preserving treatment coverage or pharmacy access for the recovering warfighter.
- Add `toolchain_id=TC-VACARE-333`, `tool_suite_id=ts-joint-va-caregiver-support-program-stipend-training-respite-continuity-v1`, and `protocol_stack_id=ps-joint-va-caregiver-support-program-stipend-training-respite-continuity-stack-v1` when family-lodging or attendant planning evolves into long-term caregiver sustainment, stipend continuity, or respite support.
- Add `toolchain_id=TC-MEDHOLD-336`, `tool_suite_id=ts-joint-convalescent-leave-limited-duty-medical-hold-continuity-v1`, and `protocol_stack_id=ps-joint-convalescent-leave-limited-duty-medical-hold-continuity-stack-v1` when attendant duration, travel legitimacy, or bedside sequencing depends on convalescent leave, limited-duty, or medhold order continuity.
- Add `packet_id=DPL-TRANSITIONAL-HEALTHCARE-TAMP-CHCBP-001`, `packet_id=DPL-VA-CAREGIVER-STIPEND-RESPITE-001`, and `packet_id=DPL-CONVALESCENT-LEAVE-MEDHOLD-001` for branches that materially alter family-travel posture, bedside-support continuity, or wounded-warrior recovery legitimacy.
