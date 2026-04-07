---
name: theater-aircrew-fatigue-circadian-countermeasure-cell
description: Balance sortie generation, crew-rest compliance, circadian disruption, and alertness-countermeasure risk for U.S. warfighters. Use when air commanders, flight surgeons, or squadron staffs must sequence crews across surge operations, time-zone shifts, or degraded basing without collapsing flight safety.
---

# Theater Aircrew Fatigue Circadian Countermeasure Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm aircraft type, sortie surge demand, crew-rest status, time-zone displacement, stimulant or waiver authorities, and mishap risk thresholds before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the fatigue problem with current flight schedule, circadian inversion, maintenance or alert posture, and crew-rest compliance.
2. Build one recommended COA and at least two alternatives with tradeoffs in sortie output, safety, waiver burden, and recovery timeline.
3. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
4. Identify decision points for crew swaps, crew-rest waivers, pharmacologic countermeasures, and sortie reprioritization.
5. Publish commander-facing recommendations plus a staff tracker with owner, suspense, confidence, and branch triggers.

## Required Output Format

1. Situation snapshot and fatigue trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and approval gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: crew-rest compliance board, circadian risk ladder, waiver decision matrix, and sortie-preservation branch brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-aircrew-fatigue-circadian-countermeasure-v1` with `protocol_stack_id=ps-theater-aircrew-fatigue-circadian-countermeasure-stack-v1`.
- Alternate: independent flight-surgeon review board with manual crew-rest ledger and sortie reprioritization worksheet.
- Degraded: commander-approved minimum-risk schedule using voice readbacks, paper waiver log, and UTC acknowledgment checks.

## Domain Packet Defaults

- Default packet ID: `DPL-AIRCREW-FATIGUE-CIRCADIAN-001`.
- Preferred `toolchain_id=TC-AIRCREW-127` and `toolchain_profile_id=aircrew-fatigue-circadian-countermeasure-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: crew-rest ledger, circadian risk model, alertness-countermeasure tracker, and sortie schedule board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed crew-status manifests, `API/JSON`, `USMTF`, and `NATO APP-11/ADatP-3 aligned exchange`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter flight safety, waiver posture, or sortie commitment.
- If authority, medical review, or crew-status trust is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, crew-rest assumptions, and waiver acknowledgment integrity.
- If checks fail, provide a degraded sortie branch with explicit safety and readiness risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag stimulant policy limits, physiological risk, mishap trends, and maintenance-driven schedule pressure early.
- Protect sensitive medical information and avoid implying flight-clearance authority the operator does not hold.
- Do not fabricate sources, approvals, or waiver authority.

## Domain Toolchain Override (2026-03-15, Expansion Wave LIV Addendum)

- Add `tool_suite_id=ts-joint-aviation-physiology-hypoxia-life-support-v1` + `protocol_stack_id=ps-joint-aviation-physiology-hypoxia-life-support-stack-v1` when fatigue branches are materially constrained by hypoxia incidents, decompression stress, or life-support equipment discrepancies.
- Add `tool_suite_id=ts-theater-sleep-recovery-shift-work-fatigue-restoration-v1` + `protocol_stack_id=ps-theater-sleep-recovery-shift-work-fatigue-restoration-stack-v1` when theater-level sleep-recovery windows, protected rest, or cross-squadron shift redesign change acceptable sortie risk.
- Add `packet_id=DPL-AVIATION-PHYSIOLOGY-HYPOXIA-LIFE-SUPPORT-001` and `packet_id=DPL-SLEEP-RECOVERY-SHIFT-WORK-FATIGUE-001` for branches that materially change crew release, waiver posture, or protected-rest enforcement.
