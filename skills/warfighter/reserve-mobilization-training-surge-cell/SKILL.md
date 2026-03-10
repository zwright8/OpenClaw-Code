---
name: reserve-mobilization-training-surge-cell
description: Synchronize reserve mobilization and compressed training pipelines for rapid force generation. Use when force expansion timelines require resource-aware training throughput and readiness risk controls.
---

# Reserve Mobilization Training Surge Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem with the required operational inputs and timing constraints.
2. Identify assumptions, disconfirming indicators, and branch triggers before building options.
3. Build one recommended option plus at least two alternatives with explicit tradeoffs.
4. Bind each critical recommendation to concrete external tools, protocol stack, and authority checks.
5. Publish commander-facing output and a staff-action tracker with owners and suspense.

## Required Output Format

Deliver results in this order:

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points and approval authorities.
5. Staff tasking and suspense dates.

## Domain Products

Primary products for this skill: mobilization surge timeline, training throughput allocation plan, readiness risk branch board.

## External Tools and Protocol Integration

- Apply the Core Integration Protocol in `../_shared/references/external-tools-protocols.md` as an explicit sequence.
- Use scenario packet guidance in `../_shared/references/domain-tool-packet-library.md` and include packet mappings.
- Use profile guidance in `../_shared/references/joint-operations-external-toolchain-profiles.md` and include degraded-mode triggers.
- Use catalog bindings in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` with a concrete tool and protocol stack.

## Tool Invocation Contract

For each critical dependency include:

- objective
- required inputs
- query/action template
- expected output schema
- transport protocol
- fallback path and confidence impact

## Domain Toolchain Override (2026-03-10, Warfighter Expansion)

- Prioritize `tool_suite_id=ts-reserve-mobilization-training-surge-v1` + `protocol_stack_id=ps-reserve-mobilization-training-surge-stack-v1` for this mission set.
- Include `packet_id=DPL-RESERVE-MOBILIZATION-TRAINING-SURGE-001` for high-consequence recommendations and branch decisions.
- Bind recommendations to `toolchain_profile_id=reserve-mobilization-training-surge-v1` in joint operations profile selection.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Separate facts, assessed judgments, and unknowns.
- Identify legal, policy, ROE, and coalition constraints early.
- Do not fabricate authorities, approvals, or source provenance.
- Require explicit human command approval for high-consequence posture changes.
