---
name: coalition-joint-cyber-fires-collateral-estimation-cell
description: Estimate and bound cyber-fires collateral effects for coalition operations with legal and cross-domain deconfliction requirements.
---

# Coalition Joint Cyber Fires Collateral Estimation Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm command echelon, mission phase, authorities, coalition constraints, and required commander decisions.
- Keep output unclassified by default unless handling guidance is provided.

## Workflow

1. Frame mission problem with time constraints, threat picture, force posture, and readiness state.
2. Build one recommended COA plus at least two alternatives with explicit tradeoffs.
3. Identify branch/sequel triggers, data dependencies, and command approval gates.
4. Bind each critical recommendation to external tools, protocol stack, and degraded-mode fallback.
5. Publish staff-action tasks with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with triggers.
4. Decision points and escalation gates.
5. Staff task tracker with owners/suspense.
6. Tool invocation packets and protocol bindings.

## Domain Products

Primary products for this skill: mission-risk brief, decision matrix, and branch trigger map.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-cyber-fires-collateral-estimation-v1` with `protocol_stack_id=ps-coalition-cyber-fires-collateral-estimation-stack-v1`.
- Alternate: choose a mission-adjacent suite from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and a corresponding stack.
- Degraded: authenticated voice/readback plus UTC acknowledgment ledger and manual sync board.

## Domain Packet Defaults

- Default packet IDs: `DPL-CYBER-FIRES-COLLATERAL-ESTIMATION-001`, `DPL-COALITION-CYBER-EFFECT-DECONFLICTION-001`.
- If no packet fully matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Use concrete suite/stack entries from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Use packet references in `../_shared/references/domain-tool-packet-library.md` and playbooks in `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include: objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
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
