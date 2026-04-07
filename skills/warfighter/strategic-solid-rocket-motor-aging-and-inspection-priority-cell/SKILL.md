---
name: strategic-solid-rocket-motor-aging-and-inspection-priority-cell
description: Prioritize inspection, storage relief, and mission allocation for aging solid rocket motors when thermal exposure, propellant degradation, or X-ray backlog threatens strategic readiness.
---

# Strategic Solid Rocket Motor Aging and Inspection Priority Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm affected motor lots, storage conditions, inspection backlog, mission demand, and release authorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with storage telemetry, aging indicators, inspection throughput, mission demand, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, safety, inspection speed, and strategic allocation.
3. Identify branch triggers for re-inspection, lot quarantine, thermal-relief transfer, or priority reallocation.
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

Primary products: motor-aging board, inspection priority ladder, and strategic allocation matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-solid-rocket-motor-aging-inspection-priority-v1` with `protocol_stack_id=ps-strategic-solid-rocket-motor-aging-inspection-priority-stack-v1`.
- Alternate: select a mission-adjacent industrial mobilization, maintenance, or launch-sustainment suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: no-new-release posture for suspect lots with manual thermal monitoring and senior sustainment approval.

## Domain Packet Defaults

- Default packet ID: `DPL-SRM-AGING-PRIORITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: propellant-aging ledger, radiographic inspection queue, storage telemetry board, and mission demand allocator.
- Preferred protocol profiles for coordination and machine exchange: `OPC UA`, signed maintenance manifests, `API/JSON`, `USMTF`, and `NIEM`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If aging confidence, inspection integrity, or release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag propulsion-safety risk, lot-trace uncertainty, inspection backlog distortion, and strategic readiness loss before recommending action.
- Do not fabricate inspection results, lot condition, or release approvals.
