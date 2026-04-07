---
name: expeditionary-obstetric-and-neonatal-emergency-support-cell
description: Coordinate obstetric emergencies, neonatal stabilization, and maternal-child evacuation for U.S. warfighters in austere or contested settings. Use when commanders or medical staffs must protect pregnant patients, newborns, or noncombatant families without collapsing trauma capacity or transport timelines.
---

# Expeditionary Obstetric And Neonatal Emergency Support Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm maternal and neonatal case load, gestational risk, operative capacity, warming and oxygen support, transport availability, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the care problem with maternal triage status, fetal or neonatal distress indicators, available blood and warming support, and evacuation constraints.
2. Build one recommended COA and at least two alternatives with tradeoffs in survival, transport burden, surgical exposure, and downstream bed capacity.
3. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
4. Identify decision points for delivery timing, neonatal resuscitation escalation, blood allocation, and maternal or infant movement.
5. Publish commander-facing recommendations plus a staff tracker with owner, suspense, confidence, and branch triggers.

## Required Output Format

1. Situation snapshot and maternal-neonatal risk posture.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and approval gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: maternal-neonatal triage board, neonatal warming and oxygen ladder, operative support matrix, and evacuation decision brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-obstetric-neonatal-emergency-support-v1` with `protocol_stack_id=ps-expeditionary-obstetric-neonatal-emergency-support-stack-v1`.
- Alternate: independent maternal-fetal medicine review with manual transport worksheet and blood-allocation cross-check.
- Degraded: commander-approved emergency care branch using paper triage, voice readbacks, and UTC acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-OBSTETRIC-NEONATAL-EMERGENCY-001`.
- Preferred `toolchain_id=TC-OBNEO-132` and `toolchain_profile_id=obstetric-neonatal-emergency-support-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: maternal-fetal triage board, neonatal warming and incubator tracker, obstetric surgical team roster, and aeromedical handoff board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `DICOM`, signed maternal-neonatal transfer manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter maternal surgery, neonatal transfer, or blood-allocation posture.
- If authority, fetal-monitoring evidence, or care-handoff trust is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, neonatal equipment assumptions, and evacuation acknowledgment integrity.
- If checks fail, provide a degraded care branch with explicit survival and transport risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag blood scarcity, incubator or warmer failure, neonatal oxygen limits, consent constraints, and transport delays early.
- Protect patient privacy and do not imply clinical privileges or transfer authority the operator does not hold.
- Do not fabricate sources, approvals, or medical capability.
