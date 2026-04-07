---
name: strategic-defense-industrial-workforce-family-stabilization-cell
description: Stabilize critical defense-industrial families so cleared workers remain available for surge production, depot repair, and strategic continuity.
---

# Strategic Defense Industrial Workforce Family Stabilization Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter workforce-family stabilization decisions across the defense industrial base.
- Confirm critical-worker demand, family-support gaps, transport or lodging constraints, and commander or senior-leader decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using critical-worker rosters, family-support demand, housing and transport constraints, and production-priority impacts.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in strategic throughput, family stability, equity, and public legitimacy.
3. Identify branch triggers for shuttle activation, lodging support, child-care substitution, spouse-support escalation, and production reprioritization.
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

Primary products: critical-worker family support matrix, shuttle and lodging priority ladder, production-risk stabilization board, and support-gap decision log.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-WORKFORCEFAM-249`, `tool_suite_id=ts-strategic-defense-industrial-workforce-family-stabilization-v1`, and `protocol_stack_id=ps-strategic-defense-industrial-workforce-family-stabilization-stack-v1`.
- Alternate: select a mission-adjacent industrial-readiness, reserve-mobilization, or family-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual critical-worker roster with command-approved support priorities and no unsupported assumption about workforce availability.

## Domain Packet Defaults

- Default packet IDs: `DPL-WORKFORCE-FAMILY-STABILIZATION-001` and `DPL-CRITICAL-WORKER-SUPPORT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: critical-worker ledger, family-support demand tracker, shuttle or lodging allocator, and production-priority board.
- Preferred protocol profiles for coordination and machine exchange: signed workforce manifests, `NIEM`, `API/JSON`, `S/MIME`, `OPC UA`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If workforce criticality, family-demand data, or support authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported workforce assumptions, inequitable support posture, industrial-legitimacy risk, and family-protection shortfalls before recommending action.
- Do not fabricate worker criticality, family-support demand, production impacts, or support commitments.
