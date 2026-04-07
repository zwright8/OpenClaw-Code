---
name: theater-aviation-fuel-lab-contamination-clearance-cell
description: Coordinate theater aviation fuel sampling, contamination adjudication, and clearance-to-fly decisions when fuel purity, additive balance, or sabotage risk threatens U.S. warfighter sortie generation.
---

# Theater Aviation Fuel Lab Contamination Clearance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm fuel-release authority, affected platforms, sample custody, and sortie-generation deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with affected tank farms, hydrants, trucks, aircraft, contamination indicators, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, sortie tempo, sustainment resilience, and contamination-spread risk.
3. Identify branch triggers for hold, segregate, flush, substitute, or release decisions.
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

Primary products: contamination adjudication board, fuel-clearance ladder, and sortie release matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-aviation-fuel-lab-contamination-clearance-v1` with `protocol_stack_id=ps-theater-aviation-fuel-lab-contamination-clearance-stack-v1`.
- Alternate: select a mission-adjacent aviation maintenance, base fuel, or logistics suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: segregated-fuel operations only with manual sample custody and commander-approved sortie exceptions.

## Domain Packet Defaults

- Default packet ID: `DPL-AVIATION-FUEL-LAB-CLEARANCE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: fuel lab LIMS, hydrant or truck telemetry board, and aircraft maintenance release queue.
- Preferred protocol profiles for coordination and machine exchange: `API/JSON`, signed lab manifests, `OPC UA`, `AIXM/FIXM`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If fuel source, sample custody, or release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag flight-safety, contamination-spread, sabotage, and environmental-discharge risk before recommending action.
- Do not fabricate lab results, custody chains, or release approvals.
