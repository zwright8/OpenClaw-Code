---
name: joint-cold-weather-clothing-layering-and-frostbite-discipline-cell
description: Coordinate cold-weather clothing posture, layering discipline, and frostbite-prevention recommendations for U.S. warfighters. Use when exposure risk, wet-gear churn, or arctic mission tempo can degrade readiness before casualties become clinically obvious.
---

# Joint Cold Weather Clothing Layering And Frostbite Discipline Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter cold-weather exposure control, clothing issue, and non-battle-injury prevention decisions.
- Confirm weather outlook, mission duration, clothing inventory, wet-gear recovery capacity, exposure history, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with ambient conditions, wind chill, personnel exposure, clothing issue status, warming capacity, and march or watch requirements.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in mobility, warmth, signature burden, and frostbite risk.
3. Identify branch triggers for gear exchange, warming rotations, pace reduction, and no-go thresholds for exposed tasks.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and medic decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: cold-weather issue ladder, frostbite-discipline matrix, and exposure-risk watchlist.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-cold-weather-clothing-frostbite-discipline-v1` with `protocol_stack_id=ps-joint-cold-weather-clothing-frostbite-discipline-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-cold-injury-frostbite-rewarming-v1` with a mission-adjacent stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: manual exposure board with paper gear issue log, timed warming rotations, and commander-approved minimum task windows only.

## Domain Packet Defaults

- Default packet ID: `DPL-COLD-WEATHER-CLOTHING-FROSTBITE-001`.
- Preferred `toolchain_id=TC-COLD-143` and `toolchain_profile_id=cold-weather-clothing-frostbite-discipline-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: cold-weather issue ledger, exposure-risk board, wet-gear rotation tracker, and casualty risk watchlist.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed clothing manifests, `OGC`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If exposure telemetry, clothing inventory truth, or medical no-go thresholds are uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag wet-clothing accumulation, warming shortfalls, peripheral numbness trends, and resupply uncertainty before recommending action.
- Do not fabricate exposure rates, medical assessments, or gear availability.
