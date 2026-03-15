---
name: homeland-base-fuel-hydrant-and-fire-suppression-recovery-cell
description: Coordinate restoration of base hydrant loops, foam reserves, and fire-suppression capacity for homeland defense support. Use when attack, outage, or cyber-physical disruption threatens safe fueling and sortie generation.
---

# Homeland Base Fuel Hydrant And Fire Suppression Recovery Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm installation authority, fire-chief release criteria, fuel demand, and continuity deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with loop status, pressure telemetry, foam inventory, and sortie demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in fueling safety, sortie tempo, fire risk, and restoration speed.
3. Identify branch or sequel triggers, isolation hold points, and release-approval gates.
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

Primary products: hydrant restoration matrix, foam reserve ladder, and sortie fueling risk board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-base-fuel-hydrant-fire-suppression-recovery-v1` with `protocol_stack_id=ps-homeland-base-fuel-hydrant-fire-suppression-recovery-stack-v1`.
- Alternate: select a mission-adjacent base-defense, civil-support, or fuel distribution suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: truck fueling only with manual isolation and continuous fire watch.

## Domain Packet Defaults

- Default packet ID: `DPL-BASE-FUEL-HYDRANT-FIRE-SUPPRESSION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: hydrant pressure telemetry board, foam concentrate inventory tracker, and emergency isolation controller.
- Preferred protocol profiles for coordination and machine exchange: `NIMS/ICS`, `OPC UA`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, fire-safety release, pressure confirmation, or hydrant isolation integrity is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag fire-suppression, fuel-contamination, sortie-flow, and civil-authority coordination risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
