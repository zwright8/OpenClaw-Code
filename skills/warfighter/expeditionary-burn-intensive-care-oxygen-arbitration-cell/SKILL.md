---
name: expeditionary-burn-intensive-care-oxygen-arbitration-cell
description: Coordinate burn-ICU oxygen allocation, ventilator load arbitration, and casualty transfer sequencing in expeditionary care. Use when burn casualties or inhalation injuries exceed available oxygen, ICU, or evacuation capacity.
---

# Expeditionary Burn Intensive Care Oxygen Arbitration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter burn-critical-care, oxygen-allocation, and casualty-transfer decisions.
- Confirm casualty mix, oxygen generation or storage status, ventilator availability, burn-bed capacity, and evacuation options before recommending action.
- Keep outputs unclassified by default unless casualty data, facility vulnerabilities, or movement timelines require protected handling.

## Workflow

1. Frame the mission problem using casualty acuity, oxygen demand, ICU load, facility constraints, and evacuation timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survival impact, oxygen burn rate, transfer risk, and clinical burden.
3. Identify branch triggers for oxygen purity loss, ventilator failure, burn-bed saturation, and transport delay.
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

Primary products: oxygen arbitration ladder, burn ICU load board, and transfer priority matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-burn-intensive-care-oxygen-arbitration-v1` with `protocol_stack_id=ps-expeditionary-burn-intensive-care-oxygen-arbitration-stack-v1`.
- Alternate: select a mission-adjacent force-health, med-log, or casualty-regulation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: lifesaving triage with manual oxygen accounting, limited ventilator redistribution, and senior clinician approval on transfer decisions.

## Domain Packet Defaults

- Default packet ID: `DPL-BURN-ICU-OXYGEN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: ICU oxygen ledger, burn score tracker, ventilator allocation board, and evacuation regulation board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `DICOM`, signed med-log manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If casualty acuity, oxygen status, or transfer authority is uncertain, downgrade to advisory-only and request human medical-command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag oxygen purity drift, triage ambiguity, delayed transport, and burn-bed overload before recommending action.
- Do not fabricate casualty outcomes, bed availability, or medical authorization.
