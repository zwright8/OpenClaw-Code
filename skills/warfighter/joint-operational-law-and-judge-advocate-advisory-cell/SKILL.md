---
name: joint-operational-law-and-judge-advocate-advisory-cell
description: Support U.S. warfighter planning and decision support for operational-law issue framing, judge-advocate advisory support, fiscal or detention authority checks, and coalition caveat awareness. Use when commanders or staffs need protocol-aware legal-risk products that remain advisory and authority-gated.
---

# Joint Operational Law And Judge Advocate Advisory Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operational-law and command-legal advisory questions.
- Confirm the decision under review, governing authorities, factual confidence, coalition caveats, fiscal or detention implications, and review timeline before recommending action.
- Keep outputs unclassified by default and minimize privileged or personally sensitive detail unless explicit handling guidance is provided.

## Workflow

1. Frame the issue using commander decision needs, applicable authorities, factual confidence, legal constraints, and deadlines.
2. Build one recommended advisory COA and at least two alternatives with explicit tradeoffs in legal risk, mission impact, speed, and reversibility.
3. Identify branch triggers for fact changes, authority denial, coalition caveat conflicts, civilian-harm concerns, and fiscal threshold crossings.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended advisory COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: legal-risk matrix, authority gate tracker, and advisory decision packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-operational-law-judge-advocate-advisory-v1` with `protocol_stack_id=ps-joint-operational-law-judge-advocate-advisory-stack-v1`.
- Alternate: select a mission-adjacent coalition, claims, or compliance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: advisory-only legal note with no recommended action until authority and facts are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-JUDGE-ADVOCATE-OPLAW-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: operational-law issue tracker, authority and claims ledger, and coalition caveat board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `CJIS`, `USMTF`, NATO APP-11/ADatP-3 aligned exchange, `S/MIME`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If the authority basis, factual record, or legal review path is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate law, policy, command judgment, assumptions, and unknowns.
- Flag detention, civilian-harm, fiscal, and coalition-caveat risks before recommending action.
- Do not fabricate legal opinions, authorities, approvals, or protected facts.
- Do not present advisory analysis as an execution order or as final legal approval.
