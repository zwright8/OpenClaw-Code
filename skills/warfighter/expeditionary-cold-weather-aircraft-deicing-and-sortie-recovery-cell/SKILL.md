---
name: expeditionary-cold-weather-aircraft-deicing-and-sortie-recovery-cell
description: Coordinate aircraft deicing, anti-icing holdover limits, and sortie recovery in severe cold-weather operations. Use when ice, snow, or freezing precipitation threaten airbase launch and recovery tempo.
---

# Expeditionary Cold Weather Aircraft Deicing And Sortie Recovery Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter air operations in freezing or icing environments.
- Confirm airfield authority, aircraft mix, deicing resources, weather confidence, and launch priorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem with aircraft queue, fluid stock, holdover limits, runway state, weather trend, and sortie priorities.
2. Build one recommended COA and at least two alternatives with tradeoffs in sortie generation, fluid burn, maintenance risk, and safety margin.
3. Identify branch triggers for launch holds, reapplication, alternate parking, runway treatment, or sortie cancellation.
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

Primary products: deicing allocation board, holdover window matrix, and sortie reflow plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-cold-weather-aircraft-deicing-sortie-recovery-v1` with `protocol_stack_id=ps-expeditionary-cold-weather-aircraft-deicing-sortie-recovery-stack-v1`.
- Alternate: select a mission-adjacent airfield, weather, or logistics suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: emergency launch or recovery for mission-essential sorties only with manual holdover tracking and expanded safety buffers.

## Domain Packet Defaults

- Default packet ID: `DPL-COLD-WEATHER-DEICING-SORTIE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: deicing fluid inventory ledger, holdover-time calculator, and sortie recovery board.
- Preferred protocol profiles for coordination and machine exchange: `METAR/TAF`, `AIXM/FIXM`, signed maintenance manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for launch, recovery, or diversion recommendations.
- If holdover validity, runway condition, or aircraft-specific guidance is uncertain, downgrade to advisory-only and request airfield authority review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified weather or maintenance facts, assessed judgments, assumptions, and unknowns.
- Do not recommend launch or recovery outside verified holdover, braking, contamination, and crosswind limits.
- Flag fluid depletion, refreeze risk, and fatigue-driven ground-crew errors before recommending action.
- Do not fabricate technical orders, weather observations, or approvals.
