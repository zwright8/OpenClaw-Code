---
name: homeland-cooling-center-load-shedding-and-generator-priority-cell
description: Coordinate cooling-center activation, load shedding, and generator priority during extreme-heat emergencies. Use when U.S. warfighters need domestic-support options that keep vulnerable populations alive under power stress and fuel scarcity.
---

# Homeland Cooling Center Load Shedding And Generator Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter cooling-center, load-shedding, and generator-priority decisions during domestic response.
- Confirm heat severity, shelter occupancy, power constraints, generator status, and restoration timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using heat-risk maps, cooling-center demand, grid stress, generator fuel burn, and medically vulnerable populations.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, outage containment, fuel consumption, and public acceptance.
3. Identify branch triggers for generator failure, cooling-center overrun, rolling blackout expansion, and potable-water stress.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and civil-authority decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: cooling-center priority ladder, generator-allocation matrix, and load-shedding mitigation packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-cooling-center-load-shedding-generator-priority-v1` with `protocol_stack_id=ps-homeland-cooling-center-load-shedding-generator-priority-stack-v1`.
- Alternate: select a mission-adjacent mass-care, energy-emergency, or public-health suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: life-safety cooling support only with manual generator prioritization and command-approved outage triage.

## Domain Packet Defaults

- Default packet ID: `DPL-COOLING-CENTER-GENERATOR-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: cooling-center occupancy board, generator-status dashboard, load-shed forecast tracker, and fuel support ledger.
- Preferred protocol profiles for coordination and machine exchange: `CAP`, `NIEM`, `OPC UA`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If shelter capacity, power telemetry, or fuel authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported generator runtime, inequitable cooling access, medically fragile population gaps, and hidden fuel dependence before recommending action.
- Do not fabricate shelter capacity, restoration ETA, or power availability.
