---
name: joint-dive-medicine-hyperbaric-and-undersea-casualty-routing-cell
description: Coordinate dive medicine, hyperbaric treatment, and undersea casualty routing for U.S. warfighters. Use when pressure injury, oxygen toxicity, or chamber capacity constrains diver recovery and mission tempo.
---

# Joint Dive Medicine, Hyperbaric, And Undersea Casualty Routing Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter dive medicine, hyperbaric capacity, and undersea casualty-routing decisions.
- Confirm dive profiles, casualty symptoms, chamber availability, evacuation access, medical authority posture, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with dive exposures, current symptoms, chamber status, salvage or rescue priorities, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in casualty survivability, chamber utilization, mission continuity, and transport burden.
3. Identify branch triggers for no-dive holds, chamber activation, med-evac, alternate treatment routing, and return-to-dive review.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and casualty-routing trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: chamber allocation ladder, diver casualty-routing plan, and no-dive or return-to-dive matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-dive-medicine-hyperbaric-routing-v1` with `protocol_stack_id=ps-joint-dive-medicine-hyperbaric-routing-stack-v1`.
- Alternate: select a mission-adjacent maritime-undersea, Role 3 medical, or salvage-diver suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: paper dive-profile log, protected voice casualty handoff, and manual chamber-release board.

## Domain Packet Defaults

- Default packet ID: `DPL-DIVE-MEDICINE-HYPERBARIC-ROUTING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: dive-profile ledger, hyperbaric chamber status board, diver medical triage queue, and undersea casualty-routing planner.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `DICOM`, signed dive-profile manifests, `OGC`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for actions that change diver release, chamber allocation, or medical-routing posture.
- If chamber availability, casualty status, or medical authority is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, casualty assumptions, and acknowledgment integrity.
- If checks fail, provide a degraded rescue branch with explicit medical and mission risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag pressure injury, oxygen toxicity, chamber overcommitment, transport delay, and incomplete dive profiles early.
- Provide coordination support only; do not invent treatment schedules, chamber settings, or independent return-to-dive clearance.

## Domain Toolchain Override (2026-04-11, Expansion Wave XCIV Addendum)

- Add `toolchain_id=TC-SPECIALMED-393`, `tool_suite_id=ts-joint-diver-submariner-pressure-qualification-special-duty-medical-continuity-v1`, and `protocol_stack_id=ps-joint-diver-submariner-pressure-qualification-special-duty-medical-continuity-stack-v1` when casualty routing or chamber allocation depends on trusted diver or submariner qualification status, pressure-exposure history, or sea-duty medical legitimacy.
- Add `packet_id=DPL-DIVER-SUBMARINER-MEDQUAL-001` for branches that materially alter undersea casualty routing, return-to-duty assumptions, or commander confidence in special-duty readiness.
