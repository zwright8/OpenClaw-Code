---
name: expeditionary-barracks-hvac-mold-and-indoor-air-quality-cell
description: Coordinate barracks HVAC continuity, mold remediation, and indoor-air-quality controls for U.S. warfighters. Use when occupancy, respiratory symptoms, or degraded life-support systems threaten readiness at expeditionary sites.
---

# Expeditionary Barracks HVAC, Mold, And Indoor Air Quality Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter life-support, habitability, and respiratory-readiness decisions in expeditionary housing and shelters.
- Confirm occupancy, HVAC status, mold or particulate findings, engineering capacity, relocation options, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with occupancy density, HVAC telemetry, moisture or mold findings, symptom reports, maintenance backlog, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in habitability, readiness, engineering demand, and relocation burden.
3. Identify branch triggers for room quarantine, HVAC shutdown, mold remediation, portable filtration deployment, and occupant relocation.
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

Primary products: barracks air-quality risk board, relocation and maintenance plan, and occupancy restriction matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-barracks-hvac-mold-indoor-air-quality-v1` with `protocol_stack_id=ps-expeditionary-barracks-hvac-mold-indoor-air-quality-stack-v1`.
- Alternate: select a mission-adjacent facility-restoration, preventive-medicine, or civil-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual room-status board, portable meter log, and occupancy cap with command readback.

## Domain Packet Defaults

- Default packet ID: `DPL-BARRACKS-HVAC-MOLD-IAQ-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: HVAC telemetry board, mold remediation ledger, industrial-hygiene sampler, and occupancy restriction planner.
- Preferred protocol profiles for coordination and machine exchange: `OPC UA`, `OGC`, `NIMS/ICS`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If occupancy risk, contamination extent, or engineering release criteria are uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag carbon-dioxide buildup, particulate spikes, mold spread, moisture-source uncertainty, and unsafe occupancy compression before recommending action.
- Do not fabricate environmental readings, engineering release criteria, or relocation approvals.
