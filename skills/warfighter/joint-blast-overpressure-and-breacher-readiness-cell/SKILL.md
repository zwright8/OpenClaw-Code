---
name: joint-blast-overpressure-and-breacher-readiness-cell
description: Coordinate blast-overpressure exposure tracking, breacher readiness, and return-to-duty decisions for U.S. warfighters. Use when live-fire, breaching, or repeated concussive exposure threatens mission capacity or safety margins.
---

# Joint Blast Overpressure And Breacher Readiness Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter blast-exposure governance, breacher qualification, and live-fire safety decisions.
- Confirm mission set, cumulative exposure data, sensor availability, medical follow-up capacity, training calendar, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with overpressure telemetry, breacher roster status, symptom reporting, qualification requirements, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, safety, training throughput, and follow-up burden.
3. Identify branch triggers for exposure pause, medical evaluation, qualification reset, and live-fire schedule adjustment.
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

Primary products: blast-exposure ledger, breacher qualification matrix, and exposure reset or no-go ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-blast-overpressure-breacher-readiness-v1` with `protocol_stack_id=ps-joint-blast-overpressure-breacher-readiness-stack-v1`.
- Alternate: select a mission-adjacent range-safety, hearing-conservation, or force-health suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual exposure sheet, paper no-go board, and medically witnessed return-to-duty log.

## Domain Packet Defaults

- Default packet ID: `DPL-BLAST-OVERPRESSURE-BREACHER-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: blast-gauge telemetry board, breacher readiness ledger, neurocognitive follow-up queue, and range scheduling board.
- Preferred protocol profiles for coordination and machine exchange: signed sensor manifests, `HL7/FHIR`, `VMF`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If exposure totals, symptom follow-up, or qualification authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag concussive symptom underreporting, sensor dropout, training pressure, and unsafe qualification compression before recommending action.
- Do not fabricate exposure totals, medical clearance, or range approval.
