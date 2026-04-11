---
name: joint-foreign-language-proficiency-bonus-dlpt-and-linguist-readiness-continuity-cell
description: Preserve foreign-language proficiency bonus legitimacy, DLPT or OPI testing continuity, and linguist assignment readiness when score expiry or testing backlog threatens U.S. warfighter compensation, mission access, or force availability.
---

# Joint Foreign Language Proficiency Bonus DLPT And Linguist Readiness Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter language-test, FLPB, and linguist-readiness continuity decisions.
- Confirm affected population, language requirement, current score validity, testing-window timeline, bonus posture, and approval authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using score-expiration risk, DLPT or OPI backlog, bonus status, linguist assignment pressure, and mission-language demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in mission access, compensation legitimacy, testing capacity, and force availability.
3. Identify branch triggers for expired scores, failed test scheduling, FLPB loss, assignment mismatch, and retraining or recertification needs.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and linguist-readiness risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: language-readiness board, FLPB decision ladder, and DLPT continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-LANG-382`, `tool_suite_id=ts-joint-foreign-language-proficiency-bonus-dlpt-linguist-readiness-continuity-v1`, and `protocol_stack_id=ps-joint-foreign-language-proficiency-bonus-dlpt-linguist-readiness-continuity-stack-v1`.
- Alternate: select a mission-adjacent compensation, training, or assignment-management suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual score-validity roster with advisory-only sequencing until testing windows, score evidence, and human language-program review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-FLPB-DLPT-LINGUIST-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: language-test scheduling board, score-validity ledger, FLPB certification tracker, and linguist assignment queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HR-XML`, signed testing notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If test evidence, bonus authority, or assignment requirement is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and score-validity evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported bonus promises, expired score risk, testing bottlenecks, and assignment mismatch before recommending action.
- Do not fabricate DLPT or OPI results, FLPB approval, assignment qualification, or score-restoration outcomes.
