---
name: joint-flight-surgeon-and-aeromedical-waiver-cell
description: Coordinate flight-surgeon review, aeromedical waiver status, and sortie-risk recommendations for U.S. warfighters. Use when crew health, medication limits, life-support discrepancies, or return-to-flight decisions could alter aviation operations.
---

# Joint Flight Surgeon And Aeromedical Waiver Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter aviation medicine, waiver governance, and sortie-release decisions.
- Confirm mission urgency, aircraft and crew set, waiver authority, privacy handling, life-support equipment status, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with aircrew medical status, waiver history, medication restrictions, physiological incident data, and aircraft or life-support discrepancies.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in mission tempo, crew safety, medical risk, and force availability.
3. Identify branch triggers for grounding, restricted-duty release, reevaluation, and alternate crew sourcing.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and surgeon decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: waiver decision ledger, sortie restriction matrix, and aeromedical risk mitigation ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-flight-surgeon-aeromedical-waiver-v1` with `protocol_stack_id=ps-joint-flight-surgeon-aeromedical-waiver-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-aviation-physiology-hypoxia-life-support-v1` with a mission-adjacent stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: manual waiver board with protected voice coordination, paper discrepancy tracking, and UTC acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-FLIGHT-SURGEON-AEROMED-WAIVER-001`.
- Preferred `toolchain_id=TC-FSURG-134` and `toolchain_profile_id=flight-surgeon-aeromedical-waiver-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: flight-surgeon waiver board, aircrew medical qualification ledger, life-support discrepancy tracker, and sortie risk board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `AIXM/FIXM`, signed waiver manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If waiver authority, privacy posture, or maintenance discrepancy data is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag privacy constraints, surgeon authority limits, maintenance discrepancies, and sortie-risk uncertainty before recommending action.
- Do not fabricate waivers, medical approvals, or return-to-flight determinations.
