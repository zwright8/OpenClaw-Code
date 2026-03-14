---
name: theater-rapid-runway-lighting-and-approach-aid-reconstitution-cell
description: Support rapid runway-lighting and approach-aid reconstitution at battle-damaged airfields. Use when sortie recovery depends on landing-aid restoration under navwar or physical damage.
---

# Theater Rapid Runway Lighting And Approach-Aid Reconstitution Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm authority, airfield release criteria, sortie priorities, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with runway damage status, lighting diagnostics, approach-aid telemetry, sortie priorities, and weather.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in sortie tempo, safety, detectability, and repair burden.
3. Identify branch/sequel triggers, degraded-operating thresholds, and command approval gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff task tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: landing-aid restoration matrix, sequencing ladder, and recertification brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-rapid-runway-lighting-and-approach-aid-reconstitution-cell-v1` with `protocol_stack_id=ps-theater-rapid-runway-lighting-and-approach-aid-reconstitution-cell-stack-v1`.
- Alternate: `tool_suite_id=ts-airfield-recovery-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: daylight or emergency-only operations with procedural control, manual recertification logs, and UTC readback confirmation.

## Domain Packet Defaults

- Default packet ID: `DPL-RUNWAY-LIGHTING-APPROACH-AID-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: airfield lighting fault-isolation boards, approach-aid integrity monitors, and sortie regeneration planners.
- Preferred protocol profiles for coordination and machine exchange: `AIXM/FIXM`, `USMTF`, `VMF`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, flight-safety evidence, or provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag flight-safety, EMCON, and airspace-deconfliction constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
