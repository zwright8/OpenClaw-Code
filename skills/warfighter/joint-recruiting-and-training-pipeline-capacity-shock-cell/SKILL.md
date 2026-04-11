---
name: joint-recruiting-and-training-pipeline-capacity-shock-cell
description: Coordinate accession demand, training-seat allocation, and instructor bottleneck relief when U.S. warfighter force generation faces recruiting shocks or schoolhouse throughput disruption.
---

# Joint Recruiting And Training Pipeline Capacity Shock Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm force-generation authorities, pipeline priorities, schoolhouse constraints, and readiness deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with accession demand, pipeline capacity, instructor availability, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness recovery, quality risk, attrition pressure, and training backlog.
3. Identify branch triggers for seat reallocation, accelerated throughput, instructor surge, deferment, or pipeline hold decisions.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: pipeline throughput forecast, seat reallocation matrix, and accession shock ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-recruiting-training-pipeline-capacity-shock-v1` with `protocol_stack_id=ps-joint-recruiting-training-pipeline-capacity-shock-stack-v1`.
- Alternate: select a mission-adjacent reserve-mobilization, training-readiness, or personnel-distribution suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: mission-essential pipelines only with command-approved seat rationing and manual backlog tracking.

## Domain Packet Defaults

- Default packet ID: `DPL-TRAINING-PIPELINE-CAPACITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: accession demand board, training seat allocator, and instructor manning tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed personnel manifests, `API/JSON`, `USMTF`, and `S/MIME`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If throughput data, training authority, or accession policy is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag training-quality erosion, instructor overload, attrition spikes, and readiness shortfalls before recommending action.
- Do not fabricate throughput data, accession demand, or training approvals.

## Domain Toolchain Override (2026-04-11, Expansion Wave XCIII Addendum)

- Add `toolchain_id=TC-MEPS-386`, `tool_suite_id=ts-joint-meps-medical-waiver-moral-screening-ship-date-continuity-v1`, and `protocol_stack_id=ps-joint-meps-medical-waiver-moral-screening-ship-date-continuity-stack-v1` when pipeline recovery depends on clearing MEPS waiver backlogs, contract discrepancies, or ship-date drift without lowering accession standards.
- Add `toolchain_id=TC-COMMISSION-387`, `tool_suite_id=ts-joint-rotc-service-academy-ocs-ots-commissioning-file-continuity-v1`, and `protocol_stack_id=ps-joint-rotc-service-academy-ocs-ots-commissioning-file-continuity-stack-v1` when officer-accession throughput depends on commissioning-file integrity, qualification evidence, or appointment timing.
- Add `toolchain_id=TC-IET-388`, `tool_suite_id=ts-joint-initial-entry-training-holdover-recycle-family-separation-continuity-v1`, and `protocol_stack_id=ps-joint-initial-entry-training-holdover-recycle-family-separation-continuity-stack-v1` when initial-entry throughput depends on resolving holdovers, recycles, pay gaps, or family-separation friction.
- Add `toolchain_id=TC-SCHOOLHOUSE-389`, `tool_suite_id=ts-joint-high-attrition-schoolhouse-selection-recycle-medhold-follow-on-orders-continuity-v1`, and `protocol_stack_id=ps-joint-high-attrition-schoolhouse-selection-recycle-medhold-follow-on-orders-continuity-stack-v1` when high-attrition schoolhouse churn, medhold delay, or follow-on-orders drift degrades future force quality.
- Add `packet_id=DPL-MEPS-WAIVER-SHIP-001`, `packet_id=DPL-COMMISSIONING-FILE-001`, `packet_id=DPL-IET-HOLDOVER-RECYCLE-001`, and `packet_id=DPL-SCHOOLHOUSE-RECYCLE-MEDHOLD-001` for branches that materially alter accession throughput, commissioning continuity, or schoolhouse retention assumptions.
