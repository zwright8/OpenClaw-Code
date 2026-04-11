---
name: joint-initial-issue-cif-ocie-clothing-record-and-mobilization-kitting-continuity-cell
description: Preserve initial issue, CIF or OCIE accountability, clothing-record legitimacy, and mobilization-kitting continuity when missing gear or record drift threatens U.S. warfighter reporting, training, or deployment timelines.
---

# Joint Initial Issue CIF OCIE Clothing Record And Mobilization Kitting Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter initial-issue, clothing-record, and mobilization-kitting continuity decisions.
- Confirm affected force population, mobilization or deployment timeline, required issue set, clothing-record posture, and property-accountability authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using reporting timeline, missing or mismatched gear, clothing-record drift, sizing or issue constraints, and training or deployment impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, accountability, fit-for-mission, and sustainment burden.
3. Identify branch triggers for missing issue lines, wrong sizes, substitute kits, record mismatch, and staged-mobilization shortages.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and kitting-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: mobilization-kitting board, clothing-record reconciliation ladder, and initial-issue continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-KITISS-369`, `tool_suite_id=ts-joint-initial-issue-cif-ocie-clothing-record-mobilization-kitting-continuity-v1`, and `protocol_stack_id=ps-joint-initial-issue-cif-ocie-clothing-record-mobilization-kitting-continuity-stack-v1`.
- Alternate: select a mission-adjacent mobilization, sustainment, or final-out suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual issue roster with advisory-only sequencing until accountability evidence, substitute-kit authority, and human supply review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-INITIAL-ISSUE-KITTING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: initial-issue board, CIF or OCIE clothing-record ledger, size or fit crosswalk, and mobilization-kitting shortage queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed issue notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If accountability evidence, issue authority, or substitute-gear legitimacy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and accountability clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported issue promises, counterfeit or non-certified substitutes, wrong-size risk, and property-accountability gaps before recommending action.
- Do not fabricate issue records, substitute approvals, or kitting completion.

## Domain Toolchain Override (2026-04-11, Expansion Wave XCI Addendum)

- Add `toolchain_id=TC-UNIFORM-377`, `tool_suite_id=ts-joint-uniform-replacement-clothing-allowance-serviceability-bridge-v1`, and `protocol_stack_id=ps-joint-uniform-replacement-clothing-allowance-serviceability-bridge-stack-v1` when kitting confidence depends on serviceable replacement uniforms, annual clothing-allowance legitimacy, or rapid correction of damaged duty items before inspection or mobilization.
- Add `packet_id=DPL-UNIFORM-REPLACEMENT-ALLOWANCE-SERVICEABILITY-001` for branches that materially alter serviceability confidence, clothing-accountability posture, or mobilization timing.
