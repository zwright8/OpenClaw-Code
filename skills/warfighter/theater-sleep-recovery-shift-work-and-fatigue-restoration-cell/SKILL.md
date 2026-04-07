---
name: theater-sleep-recovery-shift-work-and-fatigue-restoration-cell
description: Restore sleep opportunity, shift stability, and fatigue recovery across theater operations. Use when cumulative sleep loss or unstable shift design threatens decision quality, safety, or mission execution.
---

# Theater Sleep Recovery, Shift Work, And Fatigue Restoration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter sleep recovery, shift redesign, and fatigue-restoration decisions across theater operations.
- Confirm operational tempo, shift patterns, sleep debt indicators, critical nodes, relief capacity, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with current shift design, sleep opportunity, high-risk duty positions, recovery constraints, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in alertness, throughput, staffing strain, and operational continuity.
3. Identify branch triggers for shift reset, protected sleep windows, crew redistribution, stimulant policy review, and mission reprioritization.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and fatigue trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: sleep recovery matrix, shift redesign ladder, and fatigue risk heatmap.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-sleep-recovery-shift-work-fatigue-restoration-v1` with `protocol_stack_id=ps-theater-sleep-recovery-shift-work-fatigue-restoration-stack-v1`.
- Alternate: select a mission-adjacent watchfloor-fatigue, aircrew-fatigue, or surgeon-cell suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: paper shift board, voice-confirmed protected sleep windows, and UTC rest-cycle ledger.

## Domain Packet Defaults

- Default packet ID: `DPL-SLEEP-RECOVERY-SHIFT-WORK-FATIGUE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: sleep-opportunity tracker, shift stability board, fatigue biomarker or survey ledger, and relief or recovery scheduler.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed schedule manifests, `API/JSON`, `USMTF`, and `NATO APP-11/ADatP-3 aligned exchange`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for actions that change staffing posture, protected rest windows, or mission tempo.
- If staffing truth, medical review, or fatigue signal confidence is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and rest-cycle acknowledgment integrity.
- If checks fail, provide a degraded staffing branch with explicit safety and mission risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag chronic sleep debt, microsleep risk, stimulant overreliance, unfair shift loading, and unsupported waiver assumptions early.
- Do not fabricate biometrics, medical clearances, or command approvals.
