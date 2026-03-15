---
name: coalition-host-nation-rail-signaling-manual-block-reversion-cell
description: Coordinate coalition rail movement when host-nation signaling degrades and dispatch must revert to manual-block control. Use when military throughput depends on safe rail-priority governance under degraded signaling.
---

# Coalition Host Nation Rail Signaling Manual Block Reversion Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter coalition rail-mobility and host-nation dispatch decisions.
- Confirm signaling state, host-nation authorities, train position confidence, military priority cargo, and coalition caveats before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using signaling outages, train positions, cargo priorities, crew availability, and dispatch authority.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety margin, throughput, coalition interoperability, and restoration speed.
3. Identify branch triggers for manual-block activation, train spacing changes, reroute to alternate corridors, and full movement hold.
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

Primary products: manual-block release matrix, rail-priority ladder, and signaling-restoration branch plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-host-nation-rail-signaling-manual-block-reversion-v1` with `protocol_stack_id=ps-coalition-host-nation-rail-signaling-manual-block-reversion-stack-v1`.
- Alternate: select a mission-adjacent coalition-mobility, rail, or logistics suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Preferred `toolchain_id=TC-RAIL-BLOCK-113` and `toolchain_profile_id=coalition-rail-signaling-manual-block-reversion-v1`.
- Degraded: low-tempo manual dispatch only with dual readback and coalition command concurrence.

## Domain Packet Defaults

- Default packet ID: `DPL-RAIL-SIGNALING-MANUAL-BLOCK-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: signaling integrity board, dispatch reversion planner, and coalition force-flow priority ledger.
- Preferred protocol profiles for coordination and machine exchange: `EDI`, `NIEM`, `OPC UA`, `API/JSON`, `USMTF`, and NATO APP-11/ADatP-3 aligned exchange.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, `../_shared/references/domain-toolchain-profiles.md`, `../_shared/references/joint-operations-external-toolchain-profiles.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If train position, block authority, or coalition releasability is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag collision risk, block-authority gaps, rail-priority disputes, and coalition caveat conflicts before recommending action.
- Do not fabricate train positions, host-nation permissions, or movement authorities.
