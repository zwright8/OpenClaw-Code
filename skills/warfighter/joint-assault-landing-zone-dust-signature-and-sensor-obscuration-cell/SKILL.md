---
name: joint-assault-landing-zone-dust-signature-and-sensor-obscuration-cell
description: Coordinate landing-zone brownout, dust signature, and sensor obscuration control for assault or resupply aviation. Use when rotorwash, terrain, or enemy observation makes landing-zone release confidence uncertain.
---

# Joint Assault Landing Zone Dust Signature And Sensor Obscuration Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm aviation authority, landing-zone control ownership, sensor participants, and lift deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with terrain conditions, dust forecast, marking plan, and sortie sequence.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in brownout risk, detection exposure, landing tempo, and lift reliability.
3. Identify branch or sequel triggers, landing hold points, and release-approval gates.
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

Primary products: landing-zone viability matrix, brownout risk ladder, and sortie or lift sequencing board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-assault-landing-zone-dust-obscuration-control-v1` with `protocol_stack_id=ps-joint-assault-landing-zone-dust-obscuration-control-stack-v1`.
- Alternate: select a mission-adjacent aviation safety, airfield operations, or assault support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: daylight or marked landing-zone operations only with manual dust observation.

## Domain Packet Defaults

- Default packet ID: `DPL-ASSAULT-LZ-DUST-OBSCURATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: landing-zone environment monitor, rotorwash dust forecast engine, and sensor obscuration board.
- Preferred protocol profiles for coordination and machine exchange: `OGC`, `AIXM/FIXM`, `VMF`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, aviation-safety validation, landing-zone observation, or release confidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag brownout, crash, signature exposure, and marking-discipline risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
