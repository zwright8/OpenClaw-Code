---
name: homeland-wastewater-overflow-force-health-and-waterway-protection-cell
description: Coordinate wastewater-overflow response, force-health protection, and downstream waterway safeguards during domestic disruptions. Use when U.S. warfighters need support options that reduce contamination, public panic, and cascading infrastructure harm.
---

# Homeland Wastewater Overflow Force Health And Waterway Protection Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter wastewater-overflow, force-health, and downstream-waterway protection decisions during domestic response.
- Confirm overflow status, treatment-plant posture, downstream exposure risk, utility telemetry quality, and response timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using overflow locations, downstream populations, treatment capacity, contamination indicators, and public-warning needs.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in contamination control, workforce exposure, restoration speed, and public confidence.
3. Identify branch triggers for bypass release, force-health symptoms, river or harbor contamination spread, and pump-station failure.
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

Primary products: wastewater containment board, downstream warning ladder, and force-health protection packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-wastewater-overflow-force-health-waterway-protection-v1` with `protocol_stack_id=ps-homeland-wastewater-overflow-force-health-waterway-protection-stack-v1`.
- Alternate: select a mission-adjacent wastewater, public-health, or waterway-protection suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual contamination-control board with advisory-only public-warning recommendations until telemetry and sampling are revalidated.

## Domain Packet Defaults

- Default packet ID: `DPL-WASTEWATER-OVERFLOW-WATERWAY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: overflow telemetry dashboard, downstream warning board, environmental sampling tracker, and force-health exposure ledger.
- Preferred protocol profiles for coordination and machine exchange: `OPC UA`, `OGC`, `NIEM`, `API/JSON`, `CAP`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If telemetry integrity, sampling confidence, or warning authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported contamination boundaries, hidden worker exposure, downstream fishery or harbor impacts, and premature all-clear messaging before recommending action.
- Do not fabricate sampling results, utility telemetry, or environmental clearances.
