---
name: theater-hazardous-waste-burn-pit-and-ash-exposure-cell
description: Govern hazardous waste, burn-pit operations, and ash exposure across the theater. Use when disposal constraints, smoke plumes, or waste backlogs threaten force health, compliance, or base continuity.
---

# Theater Hazardous Waste, Burn Pit, And Ash Exposure Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter waste-disposition, emissions-control, and exposure-mitigation decisions across theater operations.
- Confirm waste streams, burn or disposal capacity, plume behavior, exposed populations, compliance constraints, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with waste backlog, disposal options, plume or ash spread, exposure posture, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in health protection, disposal throughput, logistics burden, and operational continuity.
3. Identify branch triggers for burn suspension, alternate disposal routing, PPE escalation, plume avoidance, and medical surveillance expansion.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and disposal-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: waste-disposition matrix, exposure risk board, and burn-status or shutdown ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-hazardous-waste-burn-pit-ash-exposure-v1` with `protocol_stack_id=ps-theater-hazardous-waste-burn-pit-ash-exposure-stack-v1`.
- Alternate: select a mission-adjacent industrial-hygiene, logistics, or civil-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual waste ledger, visual plume watch, and authenticated voice burn or halt board.

## Domain Packet Defaults

- Default packet ID: `DPL-HAZARDOUS-WASTE-BURN-PIT-ASH-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: hazardous-waste manifest ledger, emissions and plume monitor, ash sampling board, and disposal routing planner.
- Preferred protocol profiles for coordination and machine exchange: signed waste manifests, `OPC UA`, `OGC`, `NIMS/ICS`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for actions that change burn posture, disposal routing, or exposure-control posture.
- If waste pedigree, plume confidence, or compliance basis is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and disposal acknowledgment integrity.
- If checks fail, provide a degraded waste-control branch with explicit health and mission risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unknown waste composition, emissions-monitor gaps, ash dispersion uncertainty, and unsafe burn assumptions early.
- Do not fabricate manifest status, emissions readings, or environmental or command approvals.
