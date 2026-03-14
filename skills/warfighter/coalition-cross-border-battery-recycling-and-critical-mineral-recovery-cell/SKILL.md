---
name: coalition-cross-border-battery-recycling-and-critical-mineral-recovery-cell
description: Support coalition battery recycling, critical-mineral recovery, and cross-border quality governance for contested sustainment. Use when allied recovery throughput or mineral custody affects readiness.
---

# Coalition Cross-Border Battery Recycling And Critical-Mineral Recovery Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for coalition warfighter missions in this domain.
- Confirm releasability, environmental constraints, allied caveats, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with battery feedstock inventory, plant throughput, quality telemetry, coalition caveats, and transport constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, quality confidence, environmental risk, and alliance burden-sharing.
3. Identify branch/sequel triggers, degraded-production thresholds, and command approval gates.
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

Primary products: recovery matrix, mineral yield ladder, and coalition sustainment brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-cross-border-battery-recycling-and-critical-mineral-recovery-cell-v1` with `protocol_stack_id=ps-coalition-cross-border-battery-recycling-and-critical-mineral-recovery-cell-stack-v1`.
- Alternate: `tool_suite_id=ts-logistics-distribution-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: manual recovery board with coalition release gates, lot segregation, and UTC acknowledgment tracking.

## Domain Packet Defaults

- Default packet ID: `DPL-BATTERY-RECYCLING-MINERAL-RECOVERY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: battery lifecycle forensics boards, mineral recovery optimizers, and coalition throughput planners.
- Preferred protocol profiles for coordination and machine exchange: NATO APP-11/ADatP-3 aligned exchange, `USMTF`, `OGC`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, quality evidence, or provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag environmental, coalition, and industrial-safety constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
