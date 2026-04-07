---
name: joint-wounded-warrior-home-modification-and-caregiver-ramp-up-cell
description: Prepare home accessibility modifications, caregiver ramp-up, and discharge-to-home continuity for wounded warfighters transitioning from acute care or rehabilitation. Use when home readiness gaps can delay recovery, family stability, or U.S. warfighter return-to-duty decisions.
---

# Joint Wounded Warrior Home Modification And Caregiver Ramp Up Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter home-modification, caregiver-ramp-up, and discharge-to-home readiness decisions.
- Confirm injury profile, discharge timeline, home accessibility barriers, caregiver availability, prosthetic or equipment needs, and decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using discharge timing, home assessment gaps, caregiver readiness, medical equipment needs, and long-tail rehabilitation risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, speed, caregiver burden, and long-term function.
3. Identify branch triggers for home inaccessibility, caregiver attrition, equipment delay, funding denial, and temporary lodging fallback.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and discharge-to-home readiness trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: home modification priority board, caregiver ramp-up matrix, and discharge-to-home readiness packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-wounded-warrior-home-modification-caregiver-ramp-v1` with `protocol_stack_id=ps-joint-wounded-warrior-home-modification-caregiver-ramp-stack-v1`.
- Alternate: select a mission-adjacent rehabilitation, housing, or family-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual discharge-to-home checklist with no unsupported home-readiness certification until human review confirms safety and caregiver viability.

## Domain Packet Defaults

- Default packet ID: `DPL-WOUNDED-WARRIOR-HOME-CAREGIVER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: home assessment queue, caregiver training ledger, durable-medical-equipment tracker, and benefit or funding board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HL7/FHIR`, signed home-modification notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If discharge authority, home-accessibility evidence, or caregiver readiness is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsafe home layouts, caregiver burnout risk, equipment delay, and unsupported return-home timelines before recommending action.
- Do not fabricate home-inspection results, caregiver acceptance, or discharge clearance.
