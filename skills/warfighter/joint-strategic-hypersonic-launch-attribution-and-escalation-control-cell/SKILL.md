---
name: joint-strategic-hypersonic-launch-attribution-and-escalation-control-cell
description: Coordinate rapid strategic hypersonic-launch attribution and escalation-safe response branches for U.S. warfighter decision support. Use when compressed warning timelines require high-confidence attribution, consequence modeling, and tightly controlled strategic messaging.
---

# Joint Strategic Hypersonic Launch Attribution And Escalation Control Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm strategic warning authorities, release constraints, deterrence signaling rules, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with warning-source confidence, launch attribution hypotheses, defended-asset exposure, and escalation posture.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in attribution confidence, survivability, strategic stability, and miscalculation risk.
3. Identify branch/sequel triggers, release thresholds, and command approval gates.
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

Primary products: attribution confidence ladder, escalation branch matrix, and strategic warning synchronization packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-strategic-hypersonic-launch-attribution-escalation-control-v1` with `protocol_stack_id=ps-joint-strategic-hypersonic-launch-attribution-escalation-control-stack-v1`.
- Alternate: select a mission-adjacent strategic warning, missile-defense, or deterrence suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: dual-source warning corroboration board with manual strategic review lane and UTC command readback logging.

## Domain Packet Defaults

- Default packet ID: `DPL-JOINT-STRATEGIC-HYPERSONIC-LAUNCH-ATTRIBUTION-ESCALATION-CONTROL-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: launch attribution fusion board, cross-domain consequence modeler, and escalation branch governance engine.
- Preferred protocol profiles for coordination and machine exchange: `USMTF`, `Link 16 J-series`, `STIX/TAXII`, `NIEM`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, attribution confidence, or warning authenticity is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag deterrence signaling, nuclear command implications, civilian-warning coupling, and escalation hazards before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
