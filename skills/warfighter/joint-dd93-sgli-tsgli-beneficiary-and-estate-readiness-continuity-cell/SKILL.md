---
name: joint-dd93-sgli-tsgli-beneficiary-and-estate-readiness-continuity-cell
description: Preserve DD93, SGLI or TSGLI, beneficiary intent, emergency-contact accuracy, and estate-readiness continuity for U.S. warfighters during mobilization, casualty risk, recovery, or transition. Use when support-system friction is starting to create avoidable family harm or command risk.
---

# Joint DD93 SGLI TSGLI Beneficiary And Estate Readiness Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter beneficiary-trust, casualty-readiness, and estate-readiness decisions.
- Confirm affected personnel, DD93 posture, beneficiary records, casualty or transition timeline, and legal-support availability before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using DD93 freshness, SGLI or TSGLI status, beneficiary integrity, emergency-contact trust, and command timeline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in family protection, privacy exposure, administrative burden, and timing.
3. Identify branch triggers for missing beneficiary evidence, DD93 mismatch, casualty-linked urgency, TSGLI documentation gap, and estate-document expiration.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and beneficiary-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: beneficiary integrity board, DD93 or SGLI action ladder, and estate-readiness protection packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-DD93BEN-315`, `tool_suite_id=ts-joint-dd93-sgli-tsgli-beneficiary-estate-readiness-continuity-v1`, and `protocol_stack_id=ps-joint-dd93-sgli-tsgli-beneficiary-estate-readiness-continuity-stack-v1`.
- Alternate: select a mission-adjacent casualty-assistance, civil-relief, or personnel-records suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual beneficiary-priority roster with advisory-only action until identity, beneficiary evidence, and legal authority are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-DD93-SGLI-TSGLI-ESTATE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: DD93 verification board, SGLI or TSGLI case queue, beneficiary-intent ledger, and estate-readiness document tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed beneficiary notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If identity proof, beneficiary evidence, or legal execution authority is uncertain, downgrade to advisory-only and request human legal or casualty-assistance review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag stale DD93 entries, unsupported beneficiary assumptions, missing estate documents, and privacy leakage before recommending action.
- Do not fabricate beneficiary status, insurance outcomes, or estate-document validity.
