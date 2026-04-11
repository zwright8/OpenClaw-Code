---
name: joint-final-out-processing-cif-ocie-medical-dental-and-separation-clearance-cell
description: Preserve final out-processing, CIF or OCIE turn-in, medical or dental clearance, and separation-checklist legitimacy when demobilization or transition friction threatens DD214 timing, final pay, or lawful separation for U.S. warfighters.
---

# Joint Final Out Processing CIF OCIE Medical Dental And Separation Clearance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter final-out, CIF or OCIE, medical or dental clearance, and separation-legitimacy decisions.
- Confirm separation or demobilization timeline, installation or unit clearance requirements, property accountability posture, and final pay or DD214 dependencies before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using separation date, clearance-checklist status, CIF or OCIE turn-in posture, medical or dental hold points, and pay or DD214 dependencies.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in lawful separation speed, inventory accountability, medical safety, and staff burden.
3. Identify branch triggers for missing records, lost gear statements, unresolved medical or dental requirements, final-pay hold, and DD214 delay.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and separation-clearance risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: final-out clearance board, CIF or OCIE accountability ladder, and separation-legitimacy packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-FINALOUT-348`, `tool_suite_id=ts-joint-final-out-processing-cif-ocie-medical-dental-separation-clearance-v1`, and `protocol_stack_id=ps-joint-final-out-processing-cif-ocie-medical-dental-separation-clearance-stack-v1`.
- Alternate: select a mission-adjacent personnel-records, household-goods, or finance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual separation-checklist roster with advisory-only sequencing until accountability evidence, medical clearance, and release authority are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-FINAL-OUT-CIF-SEPARATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: separation clearance checklist board, CIF or OCIE turn-in ledger, medical or dental out-processing queue, and final pay or DD214 dependency tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed separation checklists, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If property accountability, medical clearance, or separation authority is uncertain, downgrade to advisory-only and request human personnel review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported separation promises, lost-property assumptions, unresolved medical holds, and fiscal-legitimacy risk before recommending action.
- Do not fabricate turn-in receipts, clearance signatures, DD214 timing, or final-pay outcomes.

## Domain Toolchain Override (2026-04-11, Expansion Wave XC Addendum)

- Add `toolchain_id=TC-KITISS-369`, `tool_suite_id=ts-joint-initial-issue-cif-ocie-clothing-record-mobilization-kitting-continuity-v1`, and `protocol_stack_id=ps-joint-initial-issue-cif-ocie-clothing-record-mobilization-kitting-continuity-stack-v1` when separation-accountability or demobilization legitimacy depends on reconciling earlier initial-issue errors, clothing-record drift, or substitute-kit exceptions before final turn-in.
- Add `packet_id=DPL-INITIAL-ISSUE-KITTING-001` for branches that materially alter CIF or OCIE accountability confidence, final-out sequencing, or separation legitimacy.
