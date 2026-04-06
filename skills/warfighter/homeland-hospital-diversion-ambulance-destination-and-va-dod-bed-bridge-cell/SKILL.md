---
name: homeland-hospital-diversion-ambulance-destination-and-va-dod-bed-bridge-cell
description: Balance hospital diversion, ambulance routing, and federal bed availability during domestic medical surges. Use when U.S. warfighters need casualty-flow recommendations that link local EMS demand with VA and DOD treatment capacity.
---

# Homeland Hospital Diversion Ambulance Destination And VA-DOD Bed Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter hospital-diversion, ambulance-destination, and VA-DOD bed-bridge decisions.
- Confirm hospital status, EMS posture, casualty mix, federal bed visibility, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using diversion status, ambulance availability, casualty demand, trauma-bed constraints, and transfer authorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survivability, throughput, transport burden, and federal support demand.
3. Identify branch triggers for diversion spread, ambulance queue saturation, trauma-bed collapse, and VA-DOD transfer delay.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and medical-authority decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: hospital-diversion matrix, ambulance-destination ladder, and VA-DOD bed-bridge packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-hospital-diversion-ambulance-va-dod-bed-bridge-v1` with `protocol_stack_id=ps-homeland-hospital-diversion-ambulance-va-dod-bed-bridge-stack-v1`.
- Alternate: select a mission-adjacent medical-regulation, trauma, or patient-movement suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: lifesaving destination routing only with manual bed confirmation and command-approved transfer priorities.

## Domain Packet Defaults

- Default packet ID: `DPL-HOSPITAL-DIVERSION-VA-DOD-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: hospital-diversion board, ambulance destination tracker, trauma-bed ledger, and transfer-routing queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, `CAP`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If diversion status, destination authority, or federal bed-bridge confirmation is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported destination promises, stale diversion data, transfer-authority gaps, and casualty-hand-off risk before recommending action.
- Do not fabricate bed availability, ambulance destinations, transfer approvals, or VA-DOD acceptance.
