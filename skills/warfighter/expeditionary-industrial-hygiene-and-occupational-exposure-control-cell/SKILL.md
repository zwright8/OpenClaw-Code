---
name: expeditionary-industrial-hygiene-and-occupational-exposure-control-cell
description: Control dust, fumes, solvents, confined-space, and shop-floor exposure risks at expeditionary sites. Use when maintenance, fabrication, fueling, or base-support work threatens force health or mission continuity.
---

# Expeditionary Industrial Hygiene And Occupational Exposure Control Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter occupational exposure control, habitability, and safe work-continuation decisions at expeditionary sites.
- Confirm work processes, suspected contaminants, sampler availability, PPE posture, ventilation status, occupancy, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with contaminant sources, exposure pathways, worker populations, engineering controls, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, throughput, health protection, and sustainment burden.
3. Identify branch triggers for stop-work, PPE escalation, ventilation isolation, confined-space restriction, and relocation.
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

Primary products: exposure control matrix, sampling priority board, and PPE or work-restriction ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-industrial-hygiene-occupational-exposure-v1` with `protocol_stack_id=ps-expeditionary-industrial-hygiene-occupational-exposure-stack-v1`.
- Alternate: select a mission-adjacent preventive-medicine, hazardous-waste, or facility-engineering suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual sample log, respirator-status board, and authenticated voice stop-work or restart ledger.

## Domain Packet Defaults

- Default packet ID: `DPL-INDUSTRIAL-HYGIENE-OCCUPATIONAL-EXPOSURE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: industrial hygiene sampling ledger, respirator fit-status board, exposure-limit tracker, and confined-space permit workflow.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed sample manifests, `OPC UA`, `OGC`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If contaminant identity, sampler calibration, or confined-space authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unknown contaminants, sampler drift, PPE mismatch, confined-space hazards, and ventilation overpromising before recommending action.
- Do not fabricate exposure readings, occupational limits, or safety approvals.
