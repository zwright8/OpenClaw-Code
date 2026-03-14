---
name: joint-ocular-trauma-vision-evac-priority-cell
description: Coordinate ocular trauma triage, vision-preservation interventions, and evacuation prioritization. Use when laser, blast, fragment, chemical, or blunt-force eye injuries threaten sight, combat effectiveness, or protected movement decisions.
---

# Joint Ocular Trauma Vision Evac Priority Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm ophthalmic consult authority, medevac options, contamination status, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with mechanism of injury, visual-acuity loss, globe-rupture indicators, contamination risk, and evacuation timing.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in vision preservation, survival, mobility, and protected transport burden.
3. Identify branch or sequel triggers, blindness-risk thresholds, and command approval gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff task tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: sight-preservation triage ladder, ocular-contamination control matrix, and evac-priority decision brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-ocular-trauma-vision-evac-priority-v1` with `protocol_stack_id=ps-joint-ocular-trauma-vision-evac-priority-stack-v1`.
- Alternate: `tool_suite_id=ts-medical-force-health-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: eye-shield and darken posture with manual visual-acuity checks, paper casualty logs, and UTC readback of medevac release.

## Domain Packet Defaults

- Default packet ID: `DPL-OCULAR-TRAUMA-VISION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: ocular imaging queue, trauma-regulation board, and chemical-exposure decon tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `USMTF`, signed clinical-image manifests, `API/JSON`, and `NATO APP-11/ADatP-3` aligned exchange.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, clinical evidence, or image provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag globe-rupture, contamination, transport, and legal constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
