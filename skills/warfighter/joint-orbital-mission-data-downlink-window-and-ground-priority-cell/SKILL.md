---
name: joint-orbital-mission-data-downlink-window-and-ground-priority-cell
description: Coordinate scarce downlink windows and ground-station priorities for orbital mission data. Use when passes, station time, or bandwidth are insufficient to deliver every product before commander decisions are due.
---

# Joint Orbital Mission Data Downlink Window And Ground Priority Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm space operations authority, ground-station ownership, product-priority rules, and decision timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with orbital pass schedule, station health, data volumes, and mission-priority demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in latency, product completeness, space-service continuity, and decision advantage.
3. Identify branch or sequel triggers, pass hold points, and release-approval gates.
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

Primary products: downlink priority board, ground-pass allocation ladder, and delayed-product risk matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-orbital-mission-data-downlink-window-ground-priority-v1` with `protocol_stack_id=ps-joint-orbital-mission-data-downlink-window-ground-priority-stack-v1`.
- Alternate: select a mission-adjacent space operations, SATCOM, or mission-data suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: one mission-essential product class per pass with deferred bulk downloads.

## Domain Packet Defaults

- Default packet ID: `DPL-ORBITAL-DOWNLINK-PRIORITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: downlink scheduler, ground-station availability board, and mission-priority queue manager.
- Preferred protocol profiles for coordination and machine exchange: `CCSDS`, signed telemetry manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, pass feasibility, ground-station confirmation, or mission-priority approval is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag orbital-conflict, downlink-delay, ground-station, and stale-product risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
