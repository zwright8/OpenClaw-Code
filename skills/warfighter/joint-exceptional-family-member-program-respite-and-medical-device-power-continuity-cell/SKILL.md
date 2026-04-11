---
name: joint-exceptional-family-member-program-respite-and-medical-device-power-continuity-cell
description: Protect readiness by stabilizing EFMP support, respite care, and power-dependent medical equipment continuity during evacuation, outage, or PCS disruption. Use when special-needs household fragility is beginning to affect force availability.
---

# Joint Exceptional Family Member Program Respite And Medical Device Power Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter family-readiness decisions where EFMP needs, respite coverage, or power-dependent medical devices affect household survivability and force availability.
- Confirm affected family members, device dependencies, respite posture, housing or shelter constraints, and command decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using EFMP case posture, device power requirements, respite coverage gaps, transport constraints, and installation or community support status.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in life safety, caregiver burden, privacy, and readiness impact.
3. Identify branch triggers for generator or battery shortfall, oxygen or refrigeration dependency, respite-provider loss, and special-needs transport instability.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and EFMP-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: EFMP continuity board, medical-device power ladder, and respite-support escalation packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-EFMP-296`, `tool_suite_id=ts-joint-efmp-respite-medical-device-power-continuity-v1`, and `protocol_stack_id=ps-joint-efmp-respite-medical-device-power-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, medical-regulation, or mass-care suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual family-support board with life-safety prioritization only until device requirements, backup power, and caregiver coverage are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-EFMP-RESPITE-POWER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: EFMP case tracker, medical-device power registry, respite-provider queue, and special-needs transport board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed DME manifests, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If clinical requirements, guardian consent, or support-provider legitimacy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect medical privacy, disability accommodation, caregiver consent, and life-safety device assumptions before recommending action.
- Do not fabricate device needs, respite availability, generator capacity, or transport access.

## Domain Toolchain Override (2026-04-11, Expansion Wave LXXXVIII Addendum)

- Add `toolchain_id=TC-EFMPSL-357`, `tool_suite_id=ts-joint-efmp-enrollment-assignment-coordination-school-liaison-continuity-v1`, and `protocol_stack_id=ps-joint-efmp-enrollment-assignment-coordination-school-liaison-continuity-stack-v1` when special-needs family stability depends on EFMP assignment screening, command sponsorship, school support, or PCS timing rather than only respite or device-power continuity.
- Add `toolchain_id=TC-HUMREAD-361`, `tool_suite_id=ts-joint-command-team-human-readiness-case-conference-escalation-v1`, and `protocol_stack_id=ps-joint-command-team-human-readiness-case-conference-escalation-stack-v1` when complex special-needs cases require deliberate command integration across medical, family, housing, and legal lanes.
- Add `packet_id=DPL-EFMP-ASSIGNMENT-SCHOOL-001` and `packet_id=DPL-HUMAN-READINESS-CASE-CONFERENCE-001` for branches that materially alter special-needs family movement, school continuity, or command confidence in household stability.
