---
name: joint-reservist-mobilization-family-readiness-synchronization-cell
description: Synchronize reserve-component mobilization with family readiness, employer continuity, and mission force-flow timelines.
---

# Joint Reservist Mobilization Family Readiness Synchronization Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm command echelon, authorities, coalition constraints, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with threat picture, mission objectives, and operational constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs.
3. Identify branch/sequel triggers, degraded-mode transitions, and staff dependencies.
4. Bind every critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff task tracker with owner, suspense, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: mobilization synchronization matrix, family-risk mitigation board, employer continuity branch map, and command decision packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-reservist-mobilization-readiness-v1` with `protocol_stack_id=ps-reservist-mobilization-readiness-stack-v1`.
- Alternate: pick a mission-adjacent suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: authenticated voice/readback plus UTC acknowledgment ledger and manual sync board.

## Domain Packet Defaults

- Default packet IDs: DPL-RESERVIST-MOBILIZATION-SYNC-001, DPL-FAMILY-READINESS-RISK-001.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Use concrete tool suites and protocol stacks in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Use packet templates in `../_shared/references/domain-tool-packet-library.md` and protocol playbooks in `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, or provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag legal, ROE, LOAC, policy, and coalition caveat constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
