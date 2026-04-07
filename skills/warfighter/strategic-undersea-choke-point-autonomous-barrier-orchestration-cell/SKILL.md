---
name: strategic-undersea-choke-point-autonomous-barrier-orchestration-cell
description: Orchestrate autonomous undersea chokepoint barriers that detect, classify, and contain hostile subsurface transit without breaking friendly, civilian, or coalition safety controls. Use when commanders must hold critical undersea gaps under contested conditions.
---

# Strategic Undersea Choke Point Autonomous Barrier Orchestration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter undersea barrier-control and maritime-denial decisions.
- Confirm chokepoint geometry, release authority, allied or civilian traffic posture, autonomy constraints, and time-sensitive detection or interdiction windows before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using chokepoint geometry, barrier inventory, adversary subsurface threat picture, and maritime safety constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in persistence, detectability, safety, sustainment burden, and escalation risk.
3. Identify branch triggers for sensor loss, autonomy-trust degradation, neutral or allied traffic conflicts, false-positive drift, and command-release failure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and undersea barrier-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: barrier coverage plan, autonomous release-control matrix, and chokepoint survivability packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-UNDERSEA-322`, `tool_suite_id=ts-strategic-undersea-chokepoint-autonomous-barrier-orchestration-v1`, and `protocol_stack_id=ps-strategic-undersea-chokepoint-autonomous-barrier-orchestration-stack-v1`.
- Alternate: `tool_suite_id=ts-maritime-undersea-v1` with `protocol_stack_id=ps-strategic-undersea-chokepoint-autonomous-barrier-orchestration-stack-v1`.
- Degraded: manual patrol-and-sensor barrier posture with human-verified release authority and no unsupported autonomous interdiction claim.

## Domain Packet Defaults

- Default packet ID: `DPL-UNDERSEA-BARRIER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: undersea sensor-grid manager, autonomous barrier-control board, seabed obstacle-status ledger, and maritime deconfliction queue.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `Link 16 J-series`, signed autonomy-release notices, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If release authority, maritime deconfliction, or autonomy-trust posture is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity across barrier-control handoffs.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag false-positive bias, allied or civilian traffic conflict, autonomous release drift, and seabed-obstacle uncertainty before recommending action.
- Do not fabricate launch or interdiction authority, contact identity, or maritime-exclusion approval.
