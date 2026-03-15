---
name: joint-aviation-physiology-hypoxia-acceleration-and-life-support-cell
description: Manage hypoxia, decompression, acceleration, and life-support equipment risk for U.S. warfighters. Use when altitude, G-loading, or oxygen-system issues threaten flight safety and sortie generation.
---

# Joint Aviation Physiology Hypoxia, Acceleration, And Life Support Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter aviation physiology risk, physiological-incident response, and life-support restriction decisions.
- Confirm aircraft type, physiological incidents, oxygen-system status, altitude or G-profile demand, crew qualification posture, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with incident history, aircraft or life-support discrepancies, sortie demand, altitude or acceleration exposure, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in sortie output, crew safety, waiver burden, and recovery timeline.
3. Identify branch triggers for grounding, equipment quarantine, altitude-chamber evaluation, med-evac, and return-to-flight review.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and physiological risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: physiological risk dashboard, life-support restriction matrix, and sortie-release advisory ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-aviation-physiology-hypoxia-life-support-v1` with `protocol_stack_id=ps-joint-aviation-physiology-hypoxia-life-support-stack-v1`.
- Alternate: select a mission-adjacent aircrew-fatigue, flight-surgeon, or maintenance-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: commander-approved minimum-risk schedule using paper discrepancy logs, protected voice readbacks, and UTC acknowledgment checks.

## Domain Packet Defaults

- Default packet ID: `DPL-AVIATION-PHYSIOLOGY-HYPOXIA-LIFE-SUPPORT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: physiological incident tracker, life-support equipment status board, altitude-chamber and training ledger, and aircraft oxygen-system health monitor.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `AIXM/FIXM`, signed life-support manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for actions that change flight posture, equipment release, or waiver posture.
- If incident data, maintenance trust, or flight-surgeon review is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and waiver acknowledgment integrity.
- If checks fail, provide a degraded sortie branch with explicit safety and readiness risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag hypoxia, acceleration injury, decompression stress, oxygen-system uncertainty, and unreviewed stimulant or waiver assumptions early.
- Provide decision support only; do not imply independent flight-clearance authority or fabricate medical approvals.
