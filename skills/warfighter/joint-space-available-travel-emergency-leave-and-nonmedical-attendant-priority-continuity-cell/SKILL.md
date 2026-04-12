---
name: joint-space-available-travel-emergency-leave-and-nonmedical-attendant-priority-continuity-cell
description: Preserve Space-Available travel, emergency-leave routing, and nonmedical-attendant priority when commercial movement collapses or cost barriers threaten bedside travel, family crisis response, or lawful compassionate movement for U.S. warfighters.
---

# Joint Space Available Travel Emergency Leave And Nonmedical Attendant Priority Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter emergency-travel and compassionate-movement continuity decisions.
- Confirm leave or attendant authority, passenger-terminal posture, travel-document readiness, patient or family emergency timeline, and command decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using emergency-leave demand, Space-A availability, nonmedical-attendant posture, travel-document readiness, and time-to-family or bedside risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in travel speed, legality, family impact, and admin burden.
3. Identify branch triggers for Space-A mission cancellation, passenger-priority downgrade, passport or visa friction, attendant approval delay, and commercial-fallback exhaustion.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and compassionate-travel risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: Space-A priority board, compassionate-travel decision ladder, and nonmedical-attendant routing packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-SPACEA-400`, `tool_suite_id=ts-joint-space-available-travel-emergency-leave-nonmedical-attendant-priority-continuity-v1`, and `protocol_stack_id=ps-joint-space-available-travel-emergency-leave-nonmedical-attendant-priority-continuity-stack-v1`.
- Alternate: select a mission-adjacent emergency-leave, wounded-warrior lodging, or overseas-movement suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual compassionate-travel roster with advisory-only sequencing until authority, manifest posture, and travel-document evidence are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-SPACEA-EMERGENCY-ATTENDANT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: passenger-terminal availability board, Space-A priority ledger, emergency-leave or attendant approval queue, and travel-document readiness tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `AIXM/FIXM`, `ICAO Doc 9303`, signed travel notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If travel authority, patient or family urgency, or passport posture is uncertain, downgrade to advisory-only and request human command or medical review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and travel-priority clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported travel promises, Space-A manifest assumptions, patient-support privacy exposure, and document-validity risk before recommending action.
- Do not fabricate flight availability, leave approval, attendant authority, or border-crossing acceptance.
