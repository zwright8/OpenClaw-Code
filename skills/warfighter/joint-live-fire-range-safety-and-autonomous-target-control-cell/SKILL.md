---
name: joint-live-fire-range-safety-and-autonomous-target-control-cell
description: Coordinate live-fire range safety, moving-target control, and autonomous target-system governance. Use when training or testing requires safe target motion, positive control, and rapid ceasefire authority under joint conditions.
---

# Joint Live Fire Range Safety And Autonomous Target Control Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter live-fire safety, autonomous target control, and test-governance decisions.
- Confirm range authority, weapon system profile, target autonomy settings, emergency-stop pathways, and civilian or airspace constraints before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using range layout, weapons envelopes, target control modes, weather, and event timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in training realism, safety margin, target availability, and schedule certainty.
3. Identify branch triggers for ceasefire, autonomous-target rollback, misfire response, and range-clear violation.
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

Primary products: range danger-area board, autonomous target control matrix, and ceasefire or destruct checklist.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-live-fire-range-safety-autonomous-target-control-v1` with `protocol_stack_id=ps-joint-live-fire-range-safety-autonomous-target-control-stack-v1`.
- Alternate: select a mission-adjacent range-control, test, or airspace-deconfliction suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: static targets only with manual positive control, single-range authority, and no autonomous motion.

## Domain Packet Defaults

- Default packet ID: `DPL-LIVE-FIRE-RANGE-SAFETY-AUTONOMOUS-TARGET-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: range control board, autonomous target telemetry monitor, and ceasefire or destruct controller.
- Preferred protocol profiles for coordination and machine exchange: `AIXM/FIXM`, `VMF`, `CoT`, `API/JSON`, `USMTF`, and signed target-control manifests.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If positive control, ceasefire authority, or danger-area integrity is uncertain, downgrade to advisory-only and request human range-authority review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag positive-control gaps, range-incursion risk, target runaway conditions, and weather-driven visibility hazards before recommending action.
- Do not fabricate safety clears, target telemetry, or approvals.
