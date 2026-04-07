---
name: joint-ballistic-meteorology-and-fire-support-calibration-cell
description: Coordinate ballistic-met collection, met-message quality, and fire-support recalibration for U.S. warfighters. Use when artillery, mortars, rockets, or naval fires depend on accurate atmospheric data under degraded sensing conditions.
---

# Joint Ballistic Meteorology And Fire Support Calibration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter fires-weather alignment, ballistic-met quality, and calibration decisions.
- Confirm firing units, supported effects timeline, observation sources, release authority, and acceptable miss-distance risk before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with firing systems, atmospheric data freshness, terrain effects, survey confidence, and fire-support timing.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in accuracy, tempo, ammunition expenditure, and fratricide risk.
3. Identify branch triggers for new upper-air data, met-message expiration, manual correction fallback, and fires-hold thresholds.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and fire-support decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: ballistic-met calibration card, fire-support correction matrix, and met-message confidence ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-ballistic-meteorology-fire-support-calibration-v1` with `protocol_stack_id=ps-joint-ballistic-meteorology-fire-support-calibration-stack-v1`.
- Alternate: a mission-adjacent weather or fires suite from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: manual met-message worksheet, firing-unit readback, and conservative correction posture only.

## Domain Packet Defaults

- Default packet ID: `DPL-BALLISTIC-METEOROLOGY-FIRE-CAL-001`.
- Preferred `toolchain_id=TC-BMET-144` and `toolchain_profile_id=ballistic-meteorology-fire-support-calibration-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: upper-air observation board, ballistic-met message tracker, fire-solution recalculation board, and survey alignment ledger.
- Preferred protocol profiles for coordination and machine exchange: `VMF`, `USMTF`, `iwxxm`, `OGC`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If met-message freshness, survey confidence, or release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag stale atmospheric data, sensor gap assumptions, and near-friendly-fire implications before recommending action.
- Do not fabricate met messages, clearance authorities, or validated firing solutions.
