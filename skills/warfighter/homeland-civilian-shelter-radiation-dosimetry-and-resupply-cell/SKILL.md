---
name: homeland-civilian-shelter-radiation-dosimetry-and-resupply-cell
description: Coordinate radiation dose tracking, shelter sustainment, and resupply for protected civilian populations. Use when homeland defense and DSCA decisions depend on shelter survivability under radiological hazard.
---

# Homeland Civilian Shelter Radiation Dosimetry And Resupply Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter homeland-defense and civil-support decisions tied to shelter survivability under radiological threat.
- Confirm shelter occupancy, dosimetry status, route viability, supply burn rates, and civil-military authorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using shelter population, dose accumulation, life-support supply status, route access, and warning timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in population survivability, convoy risk, relocation timing, and military support demand.
3. Identify branch triggers for resupply, shelter relocation, medical evacuation, and dose-driven occupancy reduction.
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

Primary products: shelter-dose dashboard, resupply ladder, and relocation trigger matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-civilian-shelter-radiation-dosimetry-resupply-v1` with `protocol_stack_id=ps-homeland-civilian-shelter-radiation-dosimetry-resupply-stack-v1`.
- Alternate: select a mission-adjacent civil-support, radiological-response, or evacuation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Preferred `toolchain_id=TC-SHELTER-RAD-116` and `toolchain_profile_id=civilian-shelter-radiation-dosimetry-resupply-v1`.
- Degraded: life-safety-first sheltering with manual dose logs and convoy-by-convoy resupply approval.

## Domain Packet Defaults

- Default packet ID: `DPL-CIVILIAN-SHELTER-RADIATION-DOSIMETRY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: shelter occupancy board, dosimetry ledger, and resupply priority queue.
- Preferred protocol profiles for coordination and machine exchange: `NIMS/ICS`, `EDXL-DE/CAP`, `NIEM`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, `../_shared/references/domain-toolchain-profiles.md`, `../_shared/references/joint-operations-external-toolchain-profiles.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If dose status, route viability, or civil-military authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag shelter overcrowding, dose-threshold uncertainty, convoy exposure, and medical fragility before recommending action.
- Do not fabricate dosimetry readings, route status, or emergency authorities.
