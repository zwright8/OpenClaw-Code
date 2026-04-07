---
name: expeditionary-sterile-processing-instrument-turnaround-and-autoclave-assurance-cell
description: Coordinate expeditionary sterile processing, instrument turnaround, and autoclave assurance. Use when surgical tempo depends on trusted sterilization cycles, biologic-indicator confidence, and limited instrument-set availability.
---

# Expeditionary Sterile Processing Instrument Turnaround and Autoclave Assurance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm operating-room demand, instrument-set inventory, sterilizer availability, indicator-test status, and reprocessing standards before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with surgical queue, set availability, autoclave cycle status, biologic-indicator results, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in OR tempo, infection risk, labor burden, and set wear.
3. Identify branch triggers for cycle failure, indicator-test delay, instrument shortage, or water and power instability.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and senior-medical decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: sterile-processing throughput board, instrument-turnaround ladder, and autoclave assurance matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-sterile-processing-instrument-turnaround-autoclave-assurance-v1` with `protocol_stack_id=ps-expeditionary-sterile-processing-instrument-turnaround-autoclave-assurance-stack-v1`.
- Alternate: select a mission-adjacent austere-surgery, biomedical-maintenance, or hospital-operations suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: instrument rationing with manual set tracking, command-approved case prioritization, and no reuse beyond validated emergency standards.

## Domain Packet Defaults

- Default packet ID: `DPL-AUTOCLAVE-STERILE-PROCESSING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: surgical-set tracker, autoclave telemetry board, biologic-indicator status board, and operating-room demand queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `OPC UA`, signed sterilization manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If sterilization proof, indicator confidence, or case-release authority is uncertain, downgrade to advisory-only and request medical-command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag failed indicator tests, water-quality instability, missing set count, and reuse pressure before recommending action.
- Do not fabricate sterilization success, instrument readiness, or OR release approval.
